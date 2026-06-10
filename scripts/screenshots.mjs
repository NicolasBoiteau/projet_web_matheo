// Capture des pages publiques du site pour la présentation.
// Usage : node scripts/screenshots.mjs  (le serveur dev doit tourner sur :3000)
import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, "..", "presentation", "screenshots")
const BASE = "http://localhost:3000"

const PAGES = [
  { path: "/", name: "accueil" },
  { path: "/cavalerie", name: "cavalerie" },
  { path: "/pensions", name: "pensions" },
  { path: "/equipe", name: "equipe" },
  { path: "/stages", name: "stages" },
  { path: "/concours", name: "concours" },
  { path: "/reservation", name: "reservation" },
  { path: "/contact", name: "contact" },
]

const run = async () => {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  for (const p of PAGES) {
    const url = BASE + p.path
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })
      // Laisse les animations Framer Motion se poser.
      await page.waitForTimeout(1200)
      const file = join(OUT, `${p.name}.png`)
      await page.screenshot({ path: file }) // viewport (above-the-fold)
      console.log(`OK   ${p.path} -> ${p.name}.png`)
    } catch (err) {
      console.log(`FAIL ${p.path} : ${err.message}`)
    }
  }

  await browser.close()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
