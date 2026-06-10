import { chromium } from "playwright"
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, "..", "presentation", "presentation-otakey.html")
const OUT = join(__dirname, "..", "presentation", "_verify")
import { mkdir } from "node:fs/promises"

const run = async () => {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle" })
  await page.waitForTimeout(800)

  // Slides à vérifier (0-indexés) : 1=En bref, 2=aperçu accueil, 3=qui fait quoi, 8=galerie, 11=fiable/gratuit
  const targets = { "09-galerie": 9, "12-gratuit": 12 }
  for (const [name, idx] of Object.entries(targets)) {
    await page.evaluate((i) => {
      const slides = document.querySelectorAll(".slide")
      slides[i].scrollIntoView()
    }, idx)
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(OUT, `${name}.png`) })
    console.log("captured", name)
  }
  await browser.close()
}
run().catch((e) => { console.error(e); process.exit(1) })
