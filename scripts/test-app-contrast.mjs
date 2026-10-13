/* The page audit only ever sees whichever dashboard happens to
   be showing. These panels have 18 pages between them, full of
   status pills and coloured numbers that exist nowhere else, so
   this walks every page of every application in both schemes
   and measures the real contrast of each. */
import { chromium } from "playwright-core";

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) =>
  0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const parse = (css) => {
  const m = String(css).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
};

const PROBE = `(() => {
  const panel = document.querySelector('[role="tabpanel"]');
  const out = [];
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)") return c;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  for (const el of panel.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim().length > 0)
      .map((n) => n.textContent.trim()).join(" ");
    if (!own) continue;
    out.push({
      text: own.slice(0, 30),
      color: cs.color,
      bg: bgOf(el),
      px: parseFloat(cs.fontSize),
      weight: cs.fontWeight,
      op: parseFloat(cs.opacity),
    });
  }
  /* SVG text sits outside the normal flow of the above */
  for (const el of panel.querySelectorAll("text")) {
    const cs = getComputedStyle(el);
    out.push({
      text: el.textContent.trim().slice(0, 30),
      color: cs.fill,
      bg: bgOf(el.closest("svg")),
      px: parseFloat(cs.fontSize) || 9,
      weight: "400",
      op: 1,
      graphic: true,
    });
  }
  return out;
})()`;

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

let fails = 0;
let measured = 0;

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1440, height: 1200 },
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3310/#what-we-do", { waitUntil: "networkidle" });
  await page.waitForSelector('[role="tabpanel"]');
  await page.waitForTimeout(1600);

  const tabCount = await page.$$eval('[role="tab"]', (e) => e.length);

  for (let t = 0; t < tabCount; t++) {
    await page.click(`[role="tab"] >> nth=${t}`);
    await page.waitForTimeout(500);
    const appName = await page.$eval(`[role="tab"] >> nth=${t}`, (e) => e.innerText.trim());
    const navCount = await page.$$eval('nav[aria-label$="sections"] button', (e) => e.length);

    for (let n = 0; n < navCount; n++) {
      await page.click(`nav[aria-label$="sections"] button >> nth=${n}`);
      await page.waitForTimeout(420);
      const pageName = await page.$eval('[role="tabpanel"] h3', (e) => e.innerText.trim());

      const nodes = await page.evaluate(PROBE);
      const bad = [];
      for (const nd of nodes) {
        const fg = parse(nd.color);
        const bg = parse(nd.bg);
        if (!fg || !bg) continue;
        measured++;
        let text = fg.rgb.map((c, i) => c * fg.a + bg.rgb[i] * (1 - fg.a));
        if (nd.op < 1) text = text.map((c, i) => c * nd.op + bg.rgb[i] * (1 - nd.op));
        const r = ratio(text, bg.rgb);
        /* axis labels on a chart are non-text content: 3:1 */
        const floor = nd.graphic ? 3 : nd.px >= 24 || (nd.px >= 18.66 && Number(nd.weight) >= 700) ? 3 : 4.5;
        if (r < floor) bad.push({ ...nd, r: r.toFixed(2), floor });
      }

      if (bad.length) {
        fails += bad.length;
        console.log(`  FAIL  ${scheme}/${appName}/${pageName}`);
        for (const b of bad.slice(0, 6))
          console.log(`          ${b.r}:1 (need ${b.floor})  ${b.px}px  "${b.text}"  ${b.color} on ${b.bg}`);
      } else {
        console.log(`  pass  ${scheme}/${appName}/${pageName}`);
      }
    }
  }
  await ctx.close();
}

await browser.close();
console.log(
  `\n${measured} text nodes measured across every page\n${fails === 0 ? "app contrast CLEAN" : fails + " failure(s)"}`,
);
process.exit(fails === 0 ? 0 : 1);
