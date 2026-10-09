import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/* ============================================================
   LAYOUT PRIMITIVES
   ------------------------------------------------------------
   One container, full width, no rail.

   Rev 1 and 2 ran a left rail down every section carrying a
   section index, which produced one continuous hairline from
   masthead to footer. It was a deliberate signature, but the
   approved art direction has no rail — sections run full width
   — and the standing line read as a stray scroll artefact
   rather than structure. Removed, along with the scroll
   progress indicator that tracked it.
   ============================================================ */

export type Surface = "light" | "paper" | "sage" | "forest" | "ink" | "graphite";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  /*
   * 1280px, down from 1680px.
   *
   * The reference holds its content in a centred column with
   * wide empty margins — measured off the live page it runs
   * about 1295px inside a 1920 viewport, roughly two-thirds of
   * the width. At 1680px our content stretched to the window
   * edges, which is why lines ran long and the page read as
   * dense rather than composed. The margin is the design.
   */
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  surface = "light",
  children,
  className,
  /** Vertical rhythm tier. */
  size = "md",
  grain = true,
  /**
   * Full-bleed hairline along the top edge.
   *
   * On a near-black page most sections share a ground, so the
   * colour change that used to mark a boundary is gone. This
   * rule does that job instead — set it on any section whose
   * predecessor has the same surface.
   */
  divider = false,
}: {
  id?: string;
  surface?: Surface;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  grain?: boolean;
  divider?: boolean;
}) {
  /*
   * Tightened after measuring the built page. `lg` was
   * py-24/32/44 — 352px of vertical padding on desktop, which
   * made the short sections mostly air: `process` measured 63%
   * padding, `what-we-build` 46%. These values keep the
   * sections that genuinely need room generous while cutting
   * roughly 100px per section off the page.
   */
  const pad =
    size === "sm"
      ? "py-14 sm:py-16 lg:py-20"
      : size === "lg"
        ? "py-20 sm:py-24 lg:py-32"
        : "py-16 sm:py-20 lg:py-24";

  return (
    <section
      id={id}
      data-surface={surface}
      className={cn(
        "relative isolate",
        grain && "lancer-grain",
        divider && "border-t border-[var(--surface-rule)]",
        pad,
        className,
      )}
    >
      <Container className="relative z-1">{children}</Container>
    </section>
  );
}

/* ------------------------------------------------------------
   SectionHeading
   ------------------------------------------------------------
   eyebrow + heading + optional lead paragraph. `accentWord`
   recedes one phrase into the muted tone, so the first half
   of a two-tone headline carries the weight. Once per section.
   ------------------------------------------------------------ */

export function SectionHeading({
  kicker,
  heading,
  accentWord,
  lead,
  level = 2,
  align = "left",
  className,
  size = "d1",
}: {
  kicker?: string;
  heading: string;
  accentWord?: string;
  lead?: string;
  level?: 1 | 2 | 3;
  align?: "left" | "wide";
  className?: string;
  size?: "d1" | "d2" | "d3";
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  const sizeClass =
    size === "d1" ? "text-d1" : size === "d2" ? "text-d2" : "text-d3";

  return (
    <div className={cn(align === "left" ? "max-w-3xl" : "max-w-5xl", className)}>
      {kicker ? <p className="eyebrow mb-5">{kicker}</p> : null}

      <Tag className={cn(sizeClass, "font-display")}>
        {renderWithAccent(heading, accentWord)}
      </Tag>

      {lead ? (
        <p className="text-lead mt-6 max-w-[58ch] text-[var(--surface-muted)]">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Splits a heading so one word can be set in serif italic. */
export function renderWithAccent(text: string, accentWord?: string) {
  if (!accentWord) return text;
  const index = text.indexOf(accentWord);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="accent-italic">{accentWord}</span>
      {text.slice(index + accentWord.length)}
    </>
  );
}

/** A labelled hairline divider — the line, split and annotated. */
export function RuleLabel({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {label ? (
        <span className="mono-label shrink-0 text-[var(--surface-muted)]">
          {label}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-[var(--surface-rule)]"
      />
    </div>
  );
}

/** Two-column editorial block: statement left, detail right. */
export function Spread({
  statement,
  children,
  className,
}: {
  statement: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-12 lg:gap-12",
        className,
      )}
    >
      <div className="lg:col-span-7">{statement}</div>
      {children ? (
        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={80}>{children}</Reveal>
        </div>
      ) : null}
    </div>
  );
}
