import { AnimatedText } from "@/components/ui/animated-text";
import { CursorIcon } from "@/components/system/cursor-icon";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { intro } from "@/lib/content";

/* ============================================================
   02 · INTRODUCTION
   ------------------------------------------------------------
   Deliberately the shortest section on the page: a statement
   and two paragraphs on an asymmetric two-column measure. No
   cards, no icons, no diagram.

   It earns its place by being the one moment of pure type
   between the hero and the capability list, which is what
   stops the top of the page reading as one continuous
   interface showcase.
   ============================================================ */

export function Intro() {
  return (
    /* `sm` — a heading and two paragraphs measured 49% padding
       at `md`. This is a breather between the hero and the
       capability list, not a section that needs room. */
    <Section id="introduction" surface="ink" size="sm" divider>
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal distance={10}>
            <CursorIcon shape="scatter" className="mb-5" />
            <p className="eyebrow">{intro.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...intro.lines]}
            accentWord={intro.accent}
            className="text-d1 mt-6 font-display"
            lineClassName="pb-[0.02em]"
          />
        </div>

        <Reveal delay={160} className="lg:col-span-5 lg:col-start-8 lg:pt-3">
          <div className="space-y-5">
            {intro.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-[1.0625rem] leading-[1.7]"
                    : "text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)]"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
