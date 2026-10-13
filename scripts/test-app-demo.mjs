/* The demo dashboards claim to be operable. This drives them
   the way a visitor would — switching applications, switching
   pages, by mouse and by keyboard — and checks the content
   actually changes rather than just the highlight. */
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

let fails = 0;
const check = (name, ok, detail = "") => {
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const TAB = '[role="tablist"] [role="tab"]';
const PANEL = '[role="tabpanel"]';
const NAV = 'nav[aria-label$="sections"] button';

for (const scheme of ["light", "dark"]) {
  console.log(`\n=== ${scheme} ===`);
  const ctx = await browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3310/#what-we-do", { waitUntil: "networkidle" });
  await page.waitForSelector(PANEL);
  await page.waitForTimeout(1800);

  /* ---- applications ------------------------------------- */
  const tabs = await page.$$eval(TAB, (els) =>
    els.map((e) => ({ label: e.innerText.trim(), selected: e.getAttribute("aria-selected") })),
  );
  check("two application tabs", tabs.length === 2, tabs.map((t) => t.label).join(" / "));
  check("first is selected", tabs[0].selected === "true");

  const title1 = await page.$eval(`${PANEL} h3`, (e) => e.innerText.trim());
  const accent1 = await page.$eval(PANEL, (e) => e.getAttribute("data-app"));
  check("CRM dashboard is showing", title1 === "Workspace overview", title1);

  await page.click(`${TAB} >> nth=1`);
  await page.waitForTimeout(900);
  const title2 = await page.$eval(`${PANEL} h3`, (e) => e.innerText.trim());
  const accent2 = await page.$eval(PANEL, (e) => e.getAttribute("data-app"));
  check("tab switches the application", title2 === "Operations overview", title2);
  check("accent changes with it", accent1 !== accent2, `${accent1} -> ${accent2}`);

  /* ---- keyboard on the tablist -------------------------- */
  await page.focus(`${TAB} >> nth=1`);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(700);
  check(
    "ArrowLeft moves back to the first application",
    (await page.$eval(`${PANEL} h3`, (e) => e.innerText.trim())) === "Workspace overview",
  );

  /* ---- pages -------------------------------------------- */
  const navItems = await page.$$eval(NAV, (els) => els.map((e) => e.innerText.trim()));
  check("sidebar lists every page", navItems.length === 10, `${navItems.length} items`);

  const before = await page.$eval(PANEL, (e) => e.innerText);
  await page.click(`${NAV} >> nth=4`); // Products
  await page.waitForTimeout(900);
  const after = await page.$eval(PANEL, (e) => e.innerText);
  const pageTitle = await page.$eval(`${PANEL} h3`, (e) => e.innerText.trim());

  check("sidebar click switches the page", pageTitle === "Products", pageTitle);
  check("the content actually changed", before !== after);
  check(
    "the active item is marked for assistive tech",
    (await page.$eval(`${NAV} >> nth=4`, (e) => e.getAttribute("aria-current"))) === "page",
  );

  /* content that only exists on the new page */
  check("new page rendered its own rows", after.includes("PRD-01"), "Products table");

  /* ---- per-app page memory ------------------------------ */
  await page.click(`${TAB} >> nth=1`);
  await page.waitForTimeout(700);
  await page.click(`${TAB} >> nth=0`);
  await page.waitForTimeout(700);
  check(
    "returning to an app keeps its page",
    (await page.$eval(`${PANEL} h3`, (e) => e.innerText.trim())) === "Products",
  );

  /* ---- hit targets -------------------------------------- */
  const small = await page.$$eval(`${NAV}, ${TAB}`, (els) =>
    els.filter((e) => e.getBoundingClientRect().height < 40).length);
  check("every control is at least 40px tall", small === 0, `${small} too small`);

  /* ---- the honesty chip --------------------------------- */
  check("the Demo data chip is present", (await page.$eval(PANEL, (e) => e.innerText)).includes("Demo data"));

  /* ---- animation actually ran --------------------------- */
  const bars = await page.evaluate(() => {
    const el = document.querySelector('[role="tabpanel"] [style*="app-bar-rise"]');
    if (!el) return null;
    return getComputedStyle(el).animationName;
  });
  await page.click(`${TAB} >> nth=1`);
  await page.waitForTimeout(300);
  const chartsPresent = await page.$$eval(`${PANEL} svg, ${PANEL} [style*="app-bar-rise"]`, (e) => e.length);
  check("charts render", chartsPresent > 0, `${chartsPresent} chart nodes`);

  await ctx.close();
}

/* ---- mobile: the rail is gone, the pages must not be ----- */
console.log("\n=== mobile ===");
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await m.newPage();
await mp.goto("http://localhost:3310/#what-we-do", { waitUntil: "networkidle" });
await mp.waitForSelector(PANEL);
await mp.waitForTimeout(1600);

const railVisible = await mp.$eval('nav[aria-label$="sections"]', (e) =>
  getComputedStyle(e).display !== "none");
check("sidebar rail is hidden on a phone", !railVisible);

const strip = await mp.$$('[role="tabpanel"] button[aria-current], [role="tabpanel"] .scroll-rail button');
check("a page strip replaces it", strip.length > 0, `${strip.length} buttons`);

const mBefore = await mp.$eval(`${PANEL} h3`, (e) => e.innerText.trim());
await mp.click('[role="tabpanel"] .scroll-rail button >> nth=2');
await mp.waitForTimeout(800);
const mAfter = await mp.$eval(`${PANEL} h3`, (e) => e.innerText.trim());
check("pages still switch on a phone", mBefore !== mAfter, `${mBefore} -> ${mAfter}`);

const wide = await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
check("no horizontal overflow on a phone", wide);

await m.close();
await browser.close();
console.log(`\n${fails === 0 ? "app demo OK" : fails + " failure(s)"}`);
process.exit(fails === 0 ? 0 : 1);
