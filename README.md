# Lancer International

Marketing and product site for Lancer International — software, SaaS and systems.
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 30 static routes
npm run typecheck
```

---

## 0. Checking the work

```bash
npm run build && npx next start -p 3000      # in one terminal

npm run audit:layout http://localhost:3000/ --shots   # proportions & reveals
npm run audit:scheme http://localhost:3000  --shots   # BOTH colour schemes
```

Both drive the installed Chrome through `playwright-core` (dev dependency, no
browser download). Neither needs a human to look at a screenshot to fail.

**`audit:layout`** — at 1440px and 390px, reports every section's height, how
much of it is padding, the tallest empty vertical band, **any element still at
`opacity: 0` after scrolling and settling**, and horizontal overflow (ignoring
SVG geometry and clipped ancestors). That `opacity: 0` check is how the 82
permanently invisible elements described below were found. **Run it after any
change to `Reveal`, `AnimatedText`, or section padding.**

**`audit:scheme`** — loads every route twice with `prefers-color-scheme`
emulated light and dark, and for each one walks every text node, flattens the
whole background stack behind it, and computes the real WCAG ratio. Anything
below AA fails the run. It exists because a themed site cannot be verified in
the scheme your machine happens to be in: the first pass after the theme landed
looked fine in dark and had 15 failures in light. **Run it after any change to
`globals.css` or to a `data-surface`.** Shots land in `audit-shots/`
(git-ignored).

---

## 0b. Brand colour — resolved

The supplied logo is navy and gold; earlier revisions of this site were deep
green and mint, and the two did not belong to the same palette. That conflict is
gone, two ways:

1. **The site is monochrome.** There is no brand-coloured accent left to clash
   with. Emphasis is weight and tone.
2. **The lockup follows the scheme.** `components/chrome/logo.tsx` renders both
   files and hides one with a `dark:` class — full-colour on a light ground,
   white on a dark one. No JS, no flash, no wrong lockup during SSR.

One asset note: the two files are trimmed differently (514×220 and 509×181), so
the wrapper reserves the taller ratio and contains both. If they are ever
re-exported on a common canvas, that `object-contain` becomes a harmless no-op.

---

## 1. The design language

**Monochrome, and it follows the system colour scheme.** Light scheme → light
grounds, dark type, the colour lockup. Dark scheme → the inverse. Nothing in the
CSS names a colour that is only correct in one of them.

### Three layers, each reading the one below

**1 · Steps.** A handful of neutral values — `--s-*` grounds, `--t-*` text,
`--rule`, `--lift`, `--metal-*`. Declared once for light, redeclared once inside
`@media (prefers-color-scheme: dark)`. **This is the only place a hex literal
appears and the only place the scheme is named.**

**2 · Surfaces.** A section declares `data-surface="ink"` (or `forest`,
`graphite`, `paper`, `light`, `sage`) and that resolves the `--surface-*`
contract — `bg`, `fg`, `muted`, `rule`, `panel`, `raised`, `sunken`, `accent`,
`accent-strong`, `cta-bg`, `cta-fg`, `lift` — out of the steps.

Most surfaces *follow* the scheme. `light` and `sage` are the one **opposing**
band: they invert against it, so the page keeps real light/dark contrast in
either scheme instead of going flat.

**3 · Components.** Only ever read `--surface-*`. A component never knows which
scheme it is in, or whether it is sitting on the following or the opposing band.

### Never alias a surface token into `@theme`

This looks like an obvious convenience and it is a trap:

```css
@theme { --color-sage: var(--surface-muted); }   /* WRONG */
```

A custom property has its `var()`s substituted **where it is declared**, and
`@theme` declares into `:root`. So `--color-sage` resolves once against root's
muted tone and every element inherits that one frozen value. Text on the
opposing band silently keeps the following band's tone — it measured 2.5–2.8:1
when this was tried, and nothing about the markup looked wrong.

Components write `text-[var(--surface-muted)]` so the cascade actually reaches
the element. There is deliberately no shorthand to get wrong.

### Never put opacity on text

`opacity-55` on a muted grey measures about 2.4:1. An earlier revision had
**133** of these and they were all failing; the nav links regressed into the
same mistake at `opacity-70` while the theme was being built. Hierarchy between
a kicker and a footnote is carried by **position, size and tone** — not by a
second, fainter grey.

Opacity is permitted only on `aria-hidden` decoration: the ghost step numerals,
the footer wordmark. `audit:scheme` skips `aria-hidden` subtrees for exactly
this reason.

### The cursor-lit objects

`CursorMark` (the hero monogram) and `CursorObject` (the sphere) are brushed
metal lit by the pointer — a CSS mask over a moving gradient stack, no WebGL.
Their tones come from `--metal-*`, which flip with the scheme: **dark steel on a
light ground, bright chrome on a dark one.** Chrome tones on an ivory page give
you a pale shape with no edge.

Neither may use a `rounded-full` glow element. A circle whose gradient fades out
before its own edge draws a visible disc around the object. Glow belongs in a
`drop-shadow`/`box-shadow`, where it takes the object's silhouette.

### Typography

- **Sora** (variable) — display and body. `-0.035em` at hero scale, `0` at body.
- **JetBrains Mono** (variable) — genuine metadata only.
- `.accent-italic` recedes one phrase into `--surface-muted`, so the first half
  of a two-tone headline carries the weight.

> The surface paint rule lives in `@layer base` on purpose — unlayered rules beat
> every layered one in the cascade, which would make a surface background
> impossible to override with a utility. The translucent masthead needs that.

Every pair was verified with a WCAG calculation, not by eye. If you change a
colour, run `npm run audit:scheme`.

---

## 2. Section devices — use the right one

Rev 1 answered "several named ideas" with a hairline-divided cell grid in about
twelve places. That monotony was the biggest single weakness. The fix was *not*
to convert them to feature cards — a row of feature cards is the most
template-looking layout in software marketing. Pick by content type:

| Content is… | Use | Why |
|---|---|---|
| Several parallel named ideas | `DefinitionList` | Editorial, no cards, no implied order |
| A genuine ordered sequence | `NumberedFlow` | One rule through N nodes; order *is* the content |
| Navigation targets | `Related` / panel grid | A target should look pressable |
| Actually tabular | hairline table | Metrics, entities, integration lists |
| A system with parts | `ErpModules` module map, `ArchitectureStack` | The layout says something structural |

**Do not number a `DefinitionList`.** If the order does not matter, numbering it
is decoration pretending to be information.

---

## 3. Replacing placeholder content

Nothing here claims a real customer, certification, office, headcount, award,
partnership, revenue figure or release date. Everything temporary is centralised:

| File | Holds |
|---|---|
| `src/lib/site-config.ts` | Name, URL, email, phone, address, social links, regions |
| `src/lib/products.ts` | Product categories, the four demo products, their interfaces |
| `src/lib/solutions.ts` | The four solution areas |
| `src/lib/services.ts` | The four engagement types |
| `src/lib/content.ts` | Homepage copy, ERP modules, principles, tech, case studies |
| `src/lib/navigation.ts` | Masthead, mega menu, mobile menu, footer sitemap |

**Specifically flagged as placeholder:**

- `siteConfig.url` — set before launch; it drives canonicals and the sitemap.
- All contact details and social `href`s (currently `#`).
- `siteConfig.regions[].note` — `[locations to be updated]`.
- `companyFacts` — founded year, headquarters, team size.
- `caseStudies` — four **demo** scenarios with `[XX%]` / `[XX hrs]` measures.
- `legalLinks` — Privacy / Terms / Security pages are not written yet.
- Product names, interfaces and all figures in `products.ts`.

Adding a product is one object in `products.ts`. The listing page, mega menu,
detail page, interactive interface and sitemap all pick it up with no other edit.

### The contact form

`src/lib/actions.ts` validates server-side and returns field-level errors. It is
**deliberately not connected to a mailbox** — see the marked block. The success
message says so rather than silently dropping an enquiry. Replace that block with
a real transport; the validated `values` object is all it needs.

Types and initial state live in `src/lib/enquiry.ts`, not in `actions.ts` — a
`"use server"` module may only export async functions, and a constant exported
from one is stripped to `undefined` at build time.

---

## 4. Structure

```
src/
  app/                      30 static routes, sitemap, robots, OG image, 404
  components/
    chrome/                 Masthead, MegaMenu, MobileMenu, Footer, ScrollSpine, Cursor
    home/                   The 17 homepage sections
    page/                   PageHero, NextStep, Related — shared by inner pages
    system/                 The diagram + interface language
    ui/                     Section/Rail, SectionHeading, DefinitionList,
                            NumberedFlow, Reveal, actions, AnimatedText
    contact/                ContactForm
  lib/                      All content and data
```

`src/components/system/` is where the visual identity lives:

- `hero-system` — the hero canvas. Three depths: the flow diagram as a faint
  underlay, the product as a dark lit panel, a white approval card in front.
  They move at different rates under the pointer, which is the only reason the
  composition is layered at all.
- `product-interface` — the interactive demo: view switching, hover/focus chart,
  sortable table, a designed empty state. It is `graphite` on an `ink` section,
  so the window is *lighter* than the room; the hero does the inverse, so the two
  product moments are not the same object twice.
- `system-diagram` — four schematic variants (`layers`, `grid`, `modules`, `loop`).
- `architecture-stack` — the vertical spine, reused with different bands.
- `integration-graph` — sources → integration layer → outputs.
- `stage-rail` — horizontal scroll storytelling on **native** overflow + snap.
- `tech-ecosystem` — technologies by architecture layer, not a logo wall.

---

## 5. Accessibility and motion

- One `<h1>` per page; sequential heading order throughout.
- Skip link, semantic landmarks, `aria-label`led diagrams with text descriptions.
- Mega menu closes on Escape and outside click; mobile menu locks scroll, traps
  Tab, and restores focus.
- ERP modules are a real tablist: roving tabindex, arrow keys, Home/End.
- The contact form has visible labels on every field, errors below their field
  and referenced by `aria-describedby`, a summary that links to each invalid
  field, focus moved to the first error, and an `aria-live` status.
- Chart marks are keyboard focusable; tooltips open on hover **and** focus; a
  visually-hidden table carries the same numbers.
- All interactive targets are at least 44px; focus rings use the surface accent
  and are never removed.
- `prefers-reduced-motion` is respected in CSS **and** read in JS, so
  scroll-driven sections resolve to their final state rather than running fast.
  `panel-interactive` also drops its hover rise.
- A `<noscript>` rule forces every revealing element visible, so the site reads
  as a complete static document with no JavaScript.

Breakpoints are exercised at 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 /
1920. Diagrams that cannot survive being scaled down — the integration graph,
the journey — are **recomposed** below `lg` rather than shrunk.

---

## 6. Things worth not undoing

- **No second filled CTA.** The footer carries one. `NextStep` is deliberately a
  rule, a sentence and an arrow.
- **The accent variant is rationed.** `AccentAction` (lime) is for terminal
  actions only — submit, start a conversation. `PrimaryAction` inherits the
  surface foreground, so it is forest on light and near-white on dark. If lime
  becomes the colour of every button it stops meaning anything.
- **The demo breaks the grid on purpose.** It is the only railless, full-bleed
  section on the homepage.
- **Global delivery is a coverage diagram, not a dotted map.** A map would be
  decoration pretending to be information, and it would imply offices the
  company has not claimed.
- **Charts stay single-series.** One series means no categorical palette, no
  legend box, and no colourblind-separation problem to get wrong. Text always
  wears text tokens, never the series colour.
- **No pills.** Small radii (6px controls, 12px panels). A pill-shaped nav or
  button is the fastest way to look like every other SaaS template.

## 7. A maintenance note

Do not bulk-edit these files with PowerShell `Get-Content` / `Set-Content`. Both
default to the system ANSI codepage and will silently turn every em dash and
middot into mojibake. Use the editor, or `[System.IO.File]::ReadAllText` /
`WriteAllText` with an explicit `UTF8Encoding($false)`.
