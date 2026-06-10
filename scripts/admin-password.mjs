// Diagnostic + réinitialisation directe d'un mot de passe via la clé service_role.
//
//   node scripts/admin-password.mjs <email>                 → diagnostic (le compte existe-t-il ?)
//   node scripts/admin-password.mjs <email> "<nouveauMdp>"  → fixe directement le mot de passe
//
// La clé service_role est lue depuis .env.local. À usage admin uniquement.

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { createClient } from "@supabase/supabase-js"

const __dirname = dirname(fileURLToPath(import.meta.url))

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
    /* ignore */
  }
  return env
}

const fileEnv = loadEnv()
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY

const email = process.argv[2]
const newPassword = process.argv[3]

if (!url || !serviceKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local")
  process.exit(1)
}
if (!email) {
  console.error('Usage : node scripts/admin-password.mjs <email> ["<nouveauMdp>"]')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserByEmail(target) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const found = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase())
    if (found) return found
    if (data.users.length < 200) break
  }
  return null
}

const user = await findUserByEmail(email)

if (!user) {
  console.log(`\n❌ Aucun compte trouvé pour "${email}" dans Supabase.`)
  console.log("   → C'est pourquoi aucun email de réinitialisation n'est envoyé.")
  console.log("   → Solution : crée d'abord le compte (page /register), ou dis-moi de le créer.\n")
  process.exit(0)
}

console.log(`\n✓ Compte trouvé pour "${email}"`)
console.log(`   id            : ${user.id}`)
console.log(`   email_confirmé: ${user.email_confirmed_at ? "oui" : "NON"}`)
console.log(`   créé le       : ${user.created_at}`)
console.log(`   dernière conn.: ${user.last_sign_in_at ?? "jamais"}`)

if (!newPassword) {
  console.log("\nℹ️  Diagnostic seulement. Pour fixer un mot de passe :")
  console.log(`   node scripts/admin-password.mjs ${email} "TonNouveauMotDePasse"\n`)
  process.exit(0)
}

const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
  password: newPassword,
  email_confirm: true,
})

if (updErr) {
  console.error(`\n❌ Échec de la mise à jour : ${updErr.message}\n`)
  process.exit(1)
}

console.log(`\n🔑 Mot de passe réinitialisé avec succès pour ${email}.`)
console.log(`   Tu peux te connecter sur /login avec ce nouveau mot de passe.\n`)
