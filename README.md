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

## 0. Checking the layout

```bash
npm run build && npx next start -p 3000      # in one terminal
npm run audit:layout http://localhost:3000/ --shots
```

Drives the installed Chrome through `playwright-core` (dev dependency, no
browser download) and reports, at 1440px and 390px:

- every section's height, how much of it is padding, and the tallest vertical
  band with nothing painted in it
- **any element still at `opacity: 0` after scrolling and settling**
- horizontal overflow, ignoring SVG geometry and clipped ancestors

That second check is the one that matters. It is how the 82 permanently
invisible elements described below were found. **Run it after any change to
`Reveal`, `AnimatedText`, or section padding.** `--shots` writes full-page
screenshots to `audit/`.

---

## 0b. Brand colour — a decision you need to make

The supplied logo (`/public/lancer-logo.png`) is **navy blue and gold**. The
approved art direction is **deep green, ivory and mint**. These do not belong to
the same palette.

Right now the site does the sensible interim thing: the white lockup
(`lancer-logo-light.png`) sits on every dark surface, where it is neutral and
clashes with nothing, and the full-colour lockup appears on the ivory masthead
once scrolled. The navy/gold is only ever visible there.

Three ways to resolve it properly, in order of how much work they are:

1. **Re-tone the site to the brand** — swap `--color-forest` / `--color-mint`
   for navy and gold in `globals.css`. Everything else re-skins automatically,
   because no component hardcodes an accent. Half a day, and the site matches
   the company's actual identity.
2. **Use the white lockup everywhere** — keep the green palette and never show
   the navy/gold. Cheapest, but the logo loses its colour.
3. **Re-draw the logo in the site palette.** A brand decision, not a code one.

---

## 1. The design language (rev 3)

**Paper and ink, lit from above.** Deep green is the substance — surfaces, type,
structure. Electric lime is the *signal*: it only ever marks flow, motion, or an
active state.

Rev 1 was a drafting table: flat hairlines, mono labels everywhere, a dusty paper
ground. Correct register for an engineering studio, wrong one for a software
product company. Rev 2 changed three things:

1. **Light is a material.** Panels carry a 1px top highlight plus a contact
   shadow plus a long soft shadow. The top highlight is what sells it — it reads
   as a real edge catching light. Dark sections get one `top-light` radial,
   anchored off-canvas so it is illumination, not an orb in the layout.
2. **Brighter, cooler ground.** Near-white canvas with true white panels. The
   contrast between the two is what makes a panel read as raised.
3. **One type family.** Host Grotesk does display *and* body. Rev 1 shipped four
   families; the serif in particular pulled everything toward magazine.

| Token | Hex | Used for |
|---|---|---|
| `ink` | `#08130F` | Deepest technical surface |
| `forest` | `#123C35` | Primary dark surface — the brand |
| `moss` | `#2A5249` | Strokes on dark |
| `graphite` | `#14181C` | Application chrome (the demo window) |
| `vellum` | `#F4F6F2` | Page canvas |
| `paper` | `#FAFBF8` | Alternate canvas |
| `surface` | `#FFFFFF` | Raised panel |
| `chalk` | `#E8ECE5` | Sunken / pressed |
| `sage` | `#A1B4AC` | Muted text on dark — 5.6:1 |
| `stone` | `#4F615B` | Muted text on light — 6.1:1 |
| `signal` | `#CBF074` | Flow / motion / active, on dark |
| `signal-dim` | `#4A7A24` | The same idea, legible on light — 4.7:1 |

### The accent is surface-dependent

This is the most useful rule in the system. Each `[data-surface]` declares its
own `--surface-accent`: lime on dark ground, deep green on light. Components ask
for `var(--surface-accent)` and are correct wherever they are dropped.

That rule exists because rev 1 hardcoded `bg-signal` / `text-signal` in a dozen
places, and five of them rendered lime on a near-white surface at roughly 1.4:1.
Never hardcode an accent again — the token already knows.

Each surface also declares `--surface-panel`, `--surface-sunken`,
`--surface-rule`, `--surface-lift` and `--surface-hairline`, so a nested panel
never needs to know which section it sits in.

> The surface paint rule lives in `@layer base` on purpose — unlayered rules beat
> every layered one in the cascade, which would make a surface background
> impossible to override with a utility. The translucent masthead needs that.

### Typography

- **Host Grotesk** (variable 300–800, plus italic) — display and body. Set to
  `-0.04em` at hero scale, `0` at body scale.
- **JetBrains Mono** (variable) — genuine metadata only. `mono-label` sits at
  450 weight, half a step above body, which reads as deliberate rather than bold.
- `.accent-italic` is the same family's italic at a lighter weight — a shift in
  voice, not a change of costume.

### Never put opacity on text

`opacity-55` on a muted grey measures about 2.4:1. Rev 1 had **133** of these
across the site and they were all failing. Hierarchy between a kicker and a
footnote is carried by **position and size**, not by a second, fainter grey.
Opacity is permitted only on `aria-hidden` decoration — the ghost numerals in
`NumberedFlow`, the footer wordmark.

Every pair in the table above was verified with a WCAG contrast calculation, not
by eye. If you change a colour, re-run that check.

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
