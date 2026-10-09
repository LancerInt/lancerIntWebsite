import { AnimatedText } from "@/components/ui/animated-text";
import { SecondaryAction } from "@/components/ui/actions";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { about } from "@/lib/content";

/* ============================================================
   07 · ABOUT
   ------------------------------------------------------------
   Three paragraphs on a generous measure and one quiet link.

   The stat bar is gone. Rev 3 had "[XX]+ projects delivered /
   [XX]+ technologies / [XX]+ industries" as editable
   placeholders, which was honest about being unfilled but
   still reserved space for a claim this company is not in a
   position to make. A growing team does not need a figures
   bar; the absence of one is itself accurate.

   No founding year, headcount, office or team biography — none
   of those are known, and the brief is explicit about not
   inventing them.
   ============================================================ */

export function About() {
  return (
    <Section id="about" surface="ink" size="md" divider>
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal distance={10}>
            <p className="eyebrow">{about.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...about.lines]}
            accentWord={about.accent}
            className="text-d1 mt-6 font-display"
            lineClassName="pb-[0.02em]"
          />
        </div>

        <Reveal delay={160} className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <div className="space-y-5">
            {about.paragraphs.map((p, i) => (
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

          <div className="mt-9">
            <SecondaryAction href={about.cta.href}>
              {about.cta.label}
            </SecondaryAction>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
