/* The custom select has to do everything the native one did.
   This drives it the way a keyboard user and a mouse user
   would, and checks the form still receives the value. */
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const URL = "http://localhost:3310/contact";
const BTN = '[role="combobox"]';
const LIST = '[role="listbox"]';

let fails = 0;
const check = (name, ok, detail = "") => {
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const reload = async () => {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
};

const value = () =>
  page.$eval('input[type="hidden"][name="topic"]', (el) => el.value);
const label = () => page.$eval(BTN, (el) => el.innerText.trim());

/* ---- 1. static semantics -------------------------------- */
await reload();
const aria = await page.$eval(BTN, (el) => ({
  role: el.getAttribute("role"),
  haspopup: el.getAttribute("aria-haspopup"),
  expanded: el.getAttribute("aria-expanded"),
  labelledby: el.getAttribute("aria-labelledby"),
  labelText: document.getElementById(el.getAttribute("aria-labelledby"))?.innerText.trim(),
  type: el.getAttribute("type"),
}));
check("role=combobox, haspopup=listbox", aria.role === "combobox" && aria.haspopup === "listbox");
check("collapsed by default", aria.expanded === "false");
check("named by its visible label", Boolean(aria.labelText?.startsWith("What would you like help with")), aria.labelText);
check("type=button (will not submit the form)", aria.type === "button");
check("no native <select> left", (await page.$$("select")).length === 0);

/* ---- 2. mouse ------------------------------------------- */
await page.click(BTN);
await page.waitForSelector(LIST);
const opts = await page.$$eval('[role="option"]', (els) => els.map((e) => e.innerText.trim()));
check("opens with all 6 options", opts.length === 6, opts.join(" / "));
check("aria-expanded flips to true", (await page.getAttribute(BTN, "aria-expanded")) === "true");

const tall = await page.$$eval('[role="option"]', (els) =>
  els.every((e) => e.getBoundingClientRect().height >= 44));
check("option hit targets >= 44px", tall);

await page.click('[role="option"] >> nth=2');
check("click selects", (await value()) === opts[2], await value());
check("list closes on select", (await page.$(LIST)) === null);
check("trigger shows the choice", (await label()) === opts[2]);

/* ---- 3. keyboard, closed -------------------------------- */
await reload();
await page.focus(BTN);
await page.keyboard.press("ArrowDown");
check("ArrowDown closed sets the first value", (await value()) === opts[0], await value());
await page.keyboard.press("ArrowDown");
check("ArrowDown closed steps forward", (await value()) === opts[1], await value());
await page.keyboard.press("ArrowUp");
check("ArrowUp closed steps back", (await value()) === opts[0], await value());
check("stepping did not open the list", (await page.$(LIST)) === null);

/* ---- 4. keyboard, open ---------------------------------- */
await page.keyboard.press("Alt+ArrowDown");
await page.waitForSelector(LIST);
check("Alt+ArrowDown opens", true);
const act1 = await page.getAttribute(BTN, "aria-activedescendant");
check("aria-activedescendant starts on the selection", Boolean(act1));
check("focus stays on the combobox", await page.$eval(BTN, (el) => el === document.activeElement));

await page.keyboard.press("ArrowDown");
const act2 = await page.getAttribute(BTN, "aria-activedescendant");
check("ArrowDown moves the active option", act1 !== act2);

await page.keyboard.press("End");
await page.keyboard.press("Enter");
check("End + Enter commits the last option", (await value()) === opts[5], await value());
check("Enter closes the list", (await page.$(LIST)) === null);

await page.keyboard.press("Enter");
await page.waitForSelector(LIST);
await page.keyboard.press("Escape");
check("Escape closes", (await page.$(LIST)) === null);
check("Escape returns focus to the trigger", await page.$eval(BTN, (el) => el === document.activeElement));
check("Escape keeps the previous value", (await value()) === opts[5]);

/* ---- 5. typeahead --------------------------------------- */
await reload();
await page.focus(BTN);
await page.keyboard.type("work", { delay: 60 });
check('typeahead "work" finds Workflow automation', (await value()) === "Workflow automation", await value());

/* ---- 6. dismissal --------------------------------------- */
await page.keyboard.press("Enter");
await page.waitForSelector(LIST);
await page.mouse.click(60, 300);
check("click outside closes", (await page.$(LIST)) === null);

/* ---- 7. the form still gets the value ------------------- */
await reload();
await page.fill('[name="name"]', "Test Person");
await page.fill('[name="email"]', "test@example.com");
await page.fill(
  '[name="message"]',
  "We would like to replace a spreadsheet process with something more reliable.",
);
await page.focus(BTN);
await page.keyboard.press("Enter");
await page.waitForSelector(LIST);
await page.click('[role="option"] >> nth=1');
const chosen = await value();

await page.click('button[type="submit"]');
await page.waitForTimeout(2500);
const body = await page.innerText("body");
check("submit round-trips without a topic error", !/closest match|select a topic/i.test(body));
check("server accepted the whole form", /not connected to a mailbox/i.test(body), chosen);

/* ---- 8. flip when there is no room below ---------------- */
await reload();
await page.$eval(BTN, (el) => el.scrollIntoView({ block: "end" }));
await page.waitForTimeout(400);
await page.click(BTN);
await page.waitForSelector(LIST);
const geom = await page.evaluate(() => {
  const b = document.querySelector('[role="combobox"]').getBoundingClientRect();
  const l = document.querySelector('[role="listbox"]').getBoundingClientRect();
  return { above: l.bottom <= b.top + 2, inView: l.bottom <= window.innerHeight + 1, lh: l.height };
});
check("list stays inside the viewport", geom.inView, geom.above ? "flipped above" : "below");

/* ---- 9. the flip path, forced ---------------------------
   Check 8 only proves the list stays in view, and on a tall
   window it never has to flip to manage that — so it passes
   without the above-the-trigger branch ever running. These two
   short viewports leave no room below, so it does. */
for (const vp of [
  { width: 1440, height: 560 },
  { width: 390, height: 640 },
]) {
  const small = await browser.newContext({ viewport: vp });
  const p2 = await small.newPage();
  await p2.goto(URL, { waitUntil: "networkidle" });
  await p2.waitForTimeout(1200);
  await p2.$eval(BTN, (el) => {
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top - (window.innerHeight - r.height - 24));
  });
  await p2.waitForTimeout(400);
  await p2.click(BTN);
  await p2.waitForSelector(LIST);
  const g = await p2.evaluate(() => {
    const b = document.querySelector('[role="combobox"]').getBoundingClientRect();
    const l = document.querySelector('[role="listbox"]').getBoundingClientRect();
    return { flipped: l.bottom <= b.top + 2, top: Math.round(l.top) };
  });
  check(`flips above at ${vp.width}x${vp.height}`, g.flipped && g.top >= 0);
  await small.close();
}

await browser.close();
console.log(`\n${fails === 0 ? "select OK" : fails + " failure(s)"}`);
process.exit(fails === 0 ? 0 : 1);
