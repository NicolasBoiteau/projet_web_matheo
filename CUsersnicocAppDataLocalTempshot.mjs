import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
// top of homepage (navbar transparent over hero)
await p.screenshot({ path: 'C:/Users/nicoc/AppData/Local/Temp/home-top.png' });
// scroll to footer
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1000);
await p.screenshot({ path: 'C:/Users/nicoc/AppData/Local/Temp/home-footer.png' });
// equipe page (uses name in subtitle)
await p.goto('http://localhost:3000/equipe', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
await p.screenshot({ path: 'C:/Users/nicoc/AppData/Local/Temp/equipe.png' });
await b.close();
console.log('done');
