// Crée (ou met à jour) deux comptes de test pour vérifier les back-offices
// moniteur et membre. Utilise la clé service_role lue depuis .env.local.
//
//   node scripts/seed-test-users.mjs
//
// Idempotent : relançable sans créer de doublons (réutilise le compte existant
// et se contente de remettre le bon rôle).

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createClient } from "@supabase/supabase-js"

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Chargement minimal de .env.local (node ne le fait pas tout seul) ---
function loadEnv() {
  const env = {}
  try {
    const raw = readFileSync(join(__dirname, "..", ".env.local"), "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let val = m[2].trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      env[m[1]] = val
    }
  } catch {
    /* fichier absent : on retombe sur process.env */
  }
  return env
}

const fileEnv = loadEnv()
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local"
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const USERS = [
  {
    email: "moniteur.test@otakey.fr",
    password: "Moniteur123!",
    role: "instructor",
    first_name: "Marc",
    last_name: "Moniteur",
  },
  {
    email: "eleve.test@otakey.fr",
    password: "Eleve123!",
    role: "member",
    first_name: "Léa",
    last_name: "Élève",
  },
]

// Retrouve un utilisateur auth par email (pagination simple).
async function findUserByEmail(email) {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (found) return found
    if (data.users.length < 200) break
  }
  return null
}

async function upsertUser(u) {
  let userId

  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { first_name: u.first_name, last_name: u.last_name },
  })

  if (createErr) {
    // Déjà inscrit : on récupère le compte existant et on réaligne le mot de passe.
    const existing = await findUserByEmail(u.email)
    if (!existing) throw createErr
    userId = existing.id
    await supabase.auth.admin.updateUserById(userId, {
      password: u.password,
      email_confirm: true,
      user_metadata: { first_name: u.first_name, last_name: u.last_name },
    })
    console.log(`↻ ${u.email} existait déjà — mis à jour`)
  } else {
    userId = created.user.id
    console.log(`✓ ${u.email} créé`)
  }

  // Le trigger handle_new_user a créé le profil ; on fixe rôle + identité.
  const { error: profileErr } = await supabase
    .from("profiles")
    .update({ role: u.role, first_name: u.first_name, last_name: u.last_name })
    .eq("id", userId)

  if (profileErr) {
    if (/check/i.test(profileErr.message) && u.role === "instructor") {
      console.error(
        `   ⚠️ Impossible de mettre le rôle "instructor" : la migration 011 ` +
          `(rôle moniteur) n'est probablement pas encore appliquée sur ta base.`
      )
    }
    throw profileErr
  }
  console.log(`   → rôle "${u.role}" appliqué`)
}

for (const u of USERS) {
  try {
    await upsertUser(u)
  } catch (e) {
    console.error(`❌ ${u.email} :`, e.message)
    process.exitCode = 1
  }
}

console.log("\nComptes de test :")
for (const u of USERS) {
  console.log(`  • ${u.role.padEnd(10)} ${u.email}  /  ${u.password}`)
}
