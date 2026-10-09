/* ============================================================
   LAYOUT AUDIT
   ------------------------------------------------------------
   Drives the installed Chrome via playwright-core (no browser
   download) and reports, per section:

     · rendered height
     · how much of that height is padding
     · the tallest vertical gap with nothing painted in it
     · any element still sitting at opacity 0 after settling
     · horizontal overflow

   Run:  node scripts/audit.mjs [url] [--shots]
   ============================================================ */

import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const URL = process.argv[2] ?? "http://localhost:3000/";
const SHOTS = process.argv.includes("--shots");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ executablePath: CHROME });

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });

  /* scroll the whole page so every IntersectionObserver fires,
     then come back to the top and let transitions settle */
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  /* Long enough for the reveal failsafe (2.5s from mount) to
     have fired. On a short page the scroll sweep finishes in
     well under that, so a shorter wait reports below-fold
     content as "invisible" when it is merely still pending. */
  await page.waitForTimeout(3200);

  const report = await page.evaluate(() => {
    const out = { total: document.body.scrollHeight, sections: [], invisible: [], overflow: [] };

    /* --- anything still transparent after settling --------- */
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.05 && el.getBoundingClientRect().height > 24) {
        if (el.closest("[aria-hidden='true']")) continue;
        if (cs.position === "absolute" && el.tagName === "IMG") continue; // logo cross-fade
        out.invisible.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 70),
          text: (el.textContent ?? "").trim().slice(0, 50),
          h: Math.round(el.getBoundingClientRect().height),
        });
      }
    }

    /* --- horizontal overflow --------------------------------
       Only counts overflow the user can actually see. Geometry
       inside an <svg> or under any clipping ancestor is not
       overflow — it is drawing, and reporting it buries the
       real hits in hundreds of false positives. */
    const docW = document.documentElement.clientWidth;
    const isClipped = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (/hidden|clip|auto|scroll/.test(cs.overflowX)) return true;
      }
      return false;
    };
    for (const el of document.querySelectorAll("body *")) {
      if (el.ownerSVGElement || el.tagName === "svg") continue;
      const r = el.getBoundingClientRect();
      if (r.width <= 0) continue;
      if (r.right <= docW + 2 && r.left >= -2) continue;
      const cs = getComputedStyle(el);
      if (cs.position === "fixed") continue;
      if (isClipped(el)) continue;
      out.overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 60),
        left: Math.round(r.left),
        right: Math.round(r.right),
      });
    }

    /* --- per section ---------------------------------------- */
    const sections = document.querySelectorAll("main > section, main > div > section, footer");
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      const cs = getComputedStyle(s);
      const padTop = parseFloat(cs.paddingTop);
      const padBottom = parseFloat(cs.paddingBottom);
      const top = r.top + window.scrollY;

      /* collect painted boxes inside, then find the biggest
         vertical band with nothing in it */
      const boxes = [];
      for (const el of s.querySelectorAll("*")) {
        const b = el.getBoundingClientRect();
        if (b.height < 2 || b.width < 2) continue;
        const st = getComputedStyle(el);
        if (st.visibility === "hidden" || parseFloat(st.opacity) < 0.05) continue;
        const hasInk =
          (el.textContent ?? "").trim().length > 0 ||
          el.tagName === "IMG" ||
          el.tagName === "SVG" ||
          st.backgroundColor !== "rgba(0, 0, 0, 0)" ||
          st.borderTopWidth !== "0px";
        if (!hasInk) continue;
        boxes.push([b.top + window.scrollY, b.bottom + window.scrollY]);
      }
      boxes.sort((a, b) => a[0] - b[0]);

      let gap = 0;
      let gapAt = 0;
      let cursor = top + padTop;
      for (const [bt, bb] of boxes) {
        if (bt - cursor > gap) {
          gap = bt - cursor;
          gapAt = cursor;
        }
        cursor = Math.max(cursor, bb);
      }
      const tailGap = top + r.height - padBottom - cursor;
      if (tailGap > gap) {
        gap = tailGap;
        gapAt = cursor;
      }

      out.sections.push({
        id: s.id || s.className.toString().slice(0, 26),
        surface: s.getAttribute("data-surface") ?? "-",
        h: Math.round(r.height),
        pad: Math.round(padTop + padBottom),
        padPct: Math.round(((padTop + padBottom) / r.height) * 100),
        gap: Math.round(gap),
        gapAt: Math.round(gapAt),
      });
    }
    return out;
  });

  console.log(`\n${"=".repeat(74)}\n  ${vp.name.toUpperCase()}  ${vp.width}x${vp.height}   page height ${report.total}px\n${"=".repeat(74)}`);
  console.log("  section                      surface    height   pad  pad%   maxgap");
  console.log("  " + "-".repeat(70));
  for (const s of report.sections) {
    const flag = s.gap > 180 ? "  <== GAP" : s.padPct > 45 ? "  <== PAD" : "";
    console.log(
      `  ${s.id.padEnd(28)} ${s.surface.padEnd(9)} ${String(s.h).padStart(6)} ${String(s.pad).padStart(5)} ${String(s.padPct).padStart(4)}% ${String(s.gap).padStart(7)}${flag}`,
    );
  }

  if (report.invisible.length) {
    console.log(`\n  !! ${report.invisible.length} element(s) still at opacity 0 after settling:`);
    for (const i of report.invisible.slice(0, 12)) {
      console.log(`     <${i.tag}> h=${i.h}  "${i.text}"  .${i.cls}`);
    }
  } else {
    console.log("\n  ok: nothing left invisible");
  }

  if (report.overflow.length) {
    console.log(`\n  !! ${report.overflow.length} element(s) overflowing horizontally:`);
    for (const o of report.overflow.slice(0, 10)) {
      console.log(`     <${o.tag}> ${o.left}..${o.right}  .${o.cls}`);
    }
  } else {
    console.log("  ok: no horizontal overflow");
  }

  if (SHOTS) {
    mkdirSync("audit", { recursive: true });
    await page.screenshot({ path: `audit/${vp.name}.png`, fullPage: true });
    console.log(`\n  shot -> audit/${vp.name}.png`);
  }

  writeFileSync(`audit-${vp.name}.json`, JSON.stringify(report, null, 2));
  await page.close();
}

await browser.close();
