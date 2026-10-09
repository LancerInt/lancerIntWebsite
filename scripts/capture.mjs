/* Screenshot an external reference so it can be looked at
   properly. Usage: node scripts/capture.mjs <url> <name> */

import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const url = process.argv[2];
const name = process.argv[3] ?? "ref";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

mkdirSync("audit", { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });

/* scroll through so lazy content and reveals fire */
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(2500);

const height = await page.evaluate(() => document.body.scrollHeight);
await page.screenshot({ path: `audit/${name}-full.png`, fullPage: true });
await page.screenshot({ path: `audit/${name}-top.png` });

/* pull the palette and type actually in use */
const facts = await page.evaluate(() => {
  const seen = new Map();
  const fonts = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width * r.height > 900) bump(seen, cs.backgroundColor);
    if ((el.textContent ?? "").trim()) {
      bump(seen, cs.color);
      bump(fonts, `${cs.fontFamily.split(",")[0]} ${cs.fontWeight}`);
    }
  }
  const top = (m, n) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  return {
    colours: top(seen, 14),
    fonts: top(fonts, 8),
    radii: top(
      new Map(
        [...document.querySelectorAll("body *")]
          .map((e) => getComputedStyle(e).borderRadius)
          .filter((r) => r && r !== "0px")
          .reduce((m, r) => m.set(r, (m.get(r) ?? 0) + 1), new Map()),
      ),
      6,
    ),
    headings: [...document.querySelectorAll("h1,h2,h3")]
      .slice(0, 14)
      .map((h) => {
        const cs = getComputedStyle(h);
        return `${h.tagName} ${cs.fontSize}/${cs.lineHeight} w${cs.fontWeight} ls${cs.letterSpacing} — ${(h.textContent ?? "").trim().slice(0, 48)}`;
      }),
  };
});

console.log(`page height ${height}px\n`);
console.log("--- colours (most used) ---");
for (const [c, n] of facts.colours) console.log(`  ${String(n).padStart(4)}  ${c}`);
console.log("\n--- fonts ---");
for (const [f, n] of facts.fonts) console.log(`  ${String(n).padStart(4)}  ${f}`);
console.log("\n--- radii ---");
for (const [r, n] of facts.radii) console.log(`  ${String(n).padStart(4)}  ${r}`);
console.log("\n--- headings ---");
for (const h of facts.headings) console.log(`  ${h}`);

await browser.close();
