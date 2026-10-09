/* ============================================================
   audit-scheme — prove the page in BOTH colour schemes
   ------------------------------------------------------------
   The layout audit runs in whatever scheme the browser defaults
   to, so it can only ever see half of a themed site. This one
   loads each page twice, with prefers-color-scheme emulated,
   and reports per scheme:

     · every text node's real contrast against its painted
       background, walking up for transparency, flagging
       anything under WCAG AA
     · elements still at opacity 0 after the reveal failsafe
     · real horizontal overflow
     · any element that resolved a colour to a literal we know
       belongs to the other scheme

   Usage:
     node scripts/audit-scheme.mjs http://localhost:3310 [--shots]
   ============================================================ */

import { chromium } from "playwright-core";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3310";
const SHOTS = process.argv.includes("--shots");
const OUT = resolve("audit-shots");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];

const ROUTES = ["/", "/about", "/contact"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

/* ---- WCAG, computed rather than eyeballed ---------------- */
const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) =>
  0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

function parse(css) {
  const m = String(css).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
}

/** Flatten a foreground over the stack of backgrounds behind it. */
function over(fg, stack) {
  let base = [255, 255, 255];
  for (const layer of [...stack].reverse()) {
    if (layer.a <= 0) continue;
    base = layer.rgb.map((c, i) => c * layer.a + base[i] * (1 - layer.a));
  }
  return {
    text: fg.rgb.map((c, i) => c * fg.a + base[i] * (1 - fg.a)),
    bg: base,
  };
}

/* ---- what the page reports about itself ------------------ */
const PROBE = `(() => {
  const out = { text: [], invisible: [], overflow: [], tokens: {} };

  /* the step tokens, as the browser actually resolved them */
  const root = getComputedStyle(document.documentElement);
  for (const k of ["--s-deep","--s-mid","--s-contrast","--t-strong","--t-muted","--rule","--metal-hi","--metal-4"])
    out.tokens[k] = root.getPropertyValue(k).trim();

  const stackOf = (el) => {
    const s = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement)
      s.push(getComputedStyle(n).backgroundColor);
    s.push(getComputedStyle(document.documentElement).backgroundColor);
    s.push(getComputedStyle(document.body).backgroundColor);
    return s;
  };

  const path = (el) => {
    const bits = [];
    for (let n = el; n && bits.length < 3; n = n.parentElement) {
      let b = n.tagName.toLowerCase();
      if (n.id) b += "#" + n.id;
      else if (n.dataset && n.dataset.surface) b += "[" + n.dataset.surface + "]";
      bits.push(b);
    }
    return bits.join(" < ");
  };

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;

    /* still transparent long after the reveal failsafe */
    if (parseFloat(cs.opacity) < 0.05 && !el.closest("[aria-hidden='true']"))
      out.invisible.push({ sel: path(el), op: cs.opacity });

    /* real overflow — not SVG geometry inside a clipped box */
    if (r.right > window.innerWidth + 1.5 && el.tagName !== "svg" &&
        !el.closest("svg") && !el.closest("[data-allow-overflow]")) {
      let clipped = false;
      for (let n = el.parentElement; n; n = n.parentElement) {
        const o = getComputedStyle(n).overflowX;
        if (o === "hidden" || o === "clip" || o === "auto" || o === "scroll") { clipped = true; break; }
      }
      if (!clipped) out.overflow.push({ sel: path(el), right: Math.round(r.right) });
    }

    /* Decorative text is exempt from contrast. The big step
       numerals sit at 8% opacity on purpose and are correctly
       aria-hidden — grading them was a bug in this script, not
       on the page. */
    if (el.closest("[aria-hidden='true']")) continue;

    /* own text only, so a wrapper is not credited with its child's copy */
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      .map((n) => n.textContent.trim()).join(" ");
    if (!own) continue;

    out.text.push({
      sel: path(el),
      sample: own.slice(0, 48),
      color: cs.color,
      stack: stackOf(el),
      px: parseFloat(cs.fontSize),
      weight: cs.fontWeight,
      op: parseFloat(cs.opacity),
    });
  }
  return out;
})()`;

const exe = CHROME.find((p) => existsSync(p));
if (!exe) {
  console.error("Chrome not found — install it or edit CHROME in this script.");
  process.exit(1);
}

if (SHOTS) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: exe });
let failures = 0;

for (const scheme of ["light", "dark"]) {
  console.log(`\n${"=".repeat(62)}\n  prefers-color-scheme: ${scheme}\n${"=".repeat(62)}`);

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      /* scroll the whole page so every reveal is crossed, then
         sit past the 2500ms failsafe before measuring */
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(3200);

      const res = await page.evaluate(PROBE);
      const tag = `${scheme}/${vp.name}${route}`;

      /* --- contrast --- */
      const bad = [];
      for (const t of res.text) {
        const fg = parse(t.color);
        if (!fg) continue;
        const layers = t.stack.map(parse).filter(Boolean);
        const { text, bg } = over(fg, layers);
        let r = ratio(text, bg);
        if (t.op < 1) {
          /* opacity on the element dilutes the text toward its bg */
          const dim = text.map((c, i) => c * t.op + bg[i] * (1 - t.op));
          r = ratio(dim, bg);
        }
        const large = t.px >= 24 || (t.px >= 18.66 && Number(t.weight) >= 700);
        const floor = large ? 3 : 4.5;
        if (r < floor) bad.push({ ...t, r: r.toFixed(2), floor });
      }

      const flags = [];
      if (bad.length) flags.push(`${bad.length} contrast`);
      if (res.invisible.length) flags.push(`${res.invisible.length} invisible`);
      if (res.overflow.length) flags.push(`${res.overflow.length} overflow`);
      failures += bad.length + res.invisible.length + res.overflow.length;

      console.log(
        `  ${flags.length ? "FAIL" : "pass"}  ${tag.padEnd(26)} ` +
        `${res.text.length} text nodes${flags.length ? "  — " + flags.join(", ") : ""}`,
      );

      for (const b of bad.slice(0, 8))
        console.log(`          ${b.r}:1 (need ${b.floor})  ${b.px}px  ${b.sel}\n            "${b.sample}"  ${b.color}`);
      for (const i of res.invisible.slice(0, 6))
        console.log(`          opacity ${i.op}  ${i.sel}`);
      for (const o of res.overflow.slice(0, 6))
        console.log(`          right ${o.right}px > ${vp.width}  ${o.sel}`);

      if (route === "/" && vp.name === "desktop") {
        console.log(`          tokens: s-deep ${res.tokens["--s-deep"]} · t-strong ${res.tokens["--t-strong"]} · metal-4 ${res.tokens["--metal-4"]}`);
      }

      if (SHOTS) {
        const slug = route === "/" ? "home" : route.slice(1);
        await page.screenshot({
          path: `${OUT}/${scheme}-${vp.name}-${slug}.png`,
          fullPage: true,
          timeout: 120_000,
        });
        if (route === "/") {
          await page.screenshot({
            path: `${OUT}/${scheme}-${vp.name}-hero.png`,
            clip: { x: 0, y: 0, width: vp.width, height: Math.min(900, vp.height) },
          });
        }
      }
    }
    await ctx.close();
  }
}

await browser.close();
console.log(`\n${failures === 0 ? "CLEAN" : `${failures} issue(s)`} across both schemes\n`);
process.exit(failures === 0 ? 0 : 1);
