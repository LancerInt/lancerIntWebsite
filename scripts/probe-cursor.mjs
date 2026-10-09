/* Detect cursor-driven transforms on a reference page.
   Snapshots every element's transform/filter, moves the mouse
   across the viewport, then reports what changed. */

import { chromium } from "playwright-core";

const url = process.argv[2];
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1500);

const snapshot = () =>
  page.evaluate(() => {
    const out = [];
    document.querySelectorAll("body *").forEach((el, i) => {
      const cs = getComputedStyle(el);
      if (cs.transform !== "none" || cs.perspective !== "none") {
        out.push({
          i,
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 48),
          t: cs.transform,
          p: cs.perspective,
          ts: cs.transformStyle,
        });
      }
    });
    return out;
  });

const before = await snapshot();

/* sweep the pointer across the hero */
for (const [x, y] of [[300, 300], [1100, 250], [1200, 600], [400, 700], [720, 450]]) {
  await page.mouse.move(x, y, { steps: 12 });
  await page.waitForTimeout(260);
}
const after = await snapshot();

const beforeMap = new Map(before.map((e) => [e.i, e]));
const changed = after.filter((e) => beforeMap.get(e.i)?.t !== e.t);

console.log(`elements with a transform at rest: ${before.length}`);
console.log(`elements whose transform CHANGED on pointer move: ${changed.length}\n`);
for (const c of changed.slice(0, 12)) {
  console.log(`  <${c.tag}> .${c.cls}`);
  console.log(`     rest : ${beforeMap.get(c.i)?.t}`);
  console.log(`     moved: ${c.t}`);
  console.log(`     perspective=${c.p} transform-style=${c.ts}\n`);
}

/* is any 3D in play at all? */
const has3d = after.filter(
  (e) => e.p !== "none" || e.ts === "preserve-3d" || /matrix3d/.test(e.t),
);
console.log(`elements using real 3D (perspective / preserve-3d / matrix3d): ${has3d.length}`);
for (const h of has3d.slice(0, 8)) {
  console.log(`  <${h.tag}> .${h.cls}  p=${h.p} ts=${h.ts}`);
}

/* canvas / webgl present? */
const canvases = await page.evaluate(() =>
  [...document.querySelectorAll("canvas")].map((c) => ({
    w: c.width,
    h: c.height,
    ctx: (() => {
      try {
        return c.getContext("webgl2") ? "webgl2" : c.getContext("webgl") ? "webgl" : "2d-or-none";
      } catch {
        return "?";
      }
    })(),
  })),
);
console.log(`\ncanvas elements: ${canvases.length}`);
for (const c of canvases) console.log(`  ${c.w}x${c.h}  ${c.ctx}`);

await browser.close();
