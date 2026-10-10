import { AnimatedText } from "@/components/ui/animated-text";
import { CursorIcon } from "@/components/system/cursor-icon";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { processIntro, processSteps } from "@/lib/content";

/* ============================================================
   04 · HOW WE WORK
   ------------------------------------------------------------
   Four steps on one rule. Numbered because the order carries
   information — understanding really does have to come before
   scoping.

   No durations, no deliverable lists, no service levels. The
   brief rules out promising fixed timescales or support
   arrangements that are not genuinely offered, and a timeline
   with weeks printed on it is exactly that promise.
   ============================================================ */

export function HowWeWork() {
  return (
    /* `forest` rather than `ink` — the one lift inside the dark
       run, so the process does not read as a continuation of
       the capability list above it. */
    <Section id="how-we-work" surface="forest" size="lg">
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal distance={10}>
            <CursorIcon shape="steps" className="mb-5" />
            <p className="eyebrow">{processIntro.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...processIntro.lines]}
            accentWord={processIntro.accent}
            className="text-d1 mt-6 font-display text-[var(--surface-fg)]"
            lineClassName="pb-[0.02em]"
          />
        </div>
      </div>

      {/* --- the steps ---------------------------------- */}
      <ol className="relative mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {processSteps.map((step, i) => (
          <Reveal
            as="li"
            key={step.index}
            delay={i * 70}
            distance={14}
            className="group relative pt-12"
          >
            {/* oversized ghost numeral behind the label */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 font-display text-[3rem] leading-none font-medium tracking-[-0.04em] text-[var(--surface-fg)] opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.16]"
            >
              {step.index}
            </span>

            {/* the rule and its node */}
            <span
              aria-hidden="true"
              className="absolute top-9 right-0 left-0 h-px bg-[var(--surface-rule)]"
            />
            <span
              aria-hidden="true"
              className="absolute top-9 left-0 size-[7px] -translate-y-1/2 rounded-full bg-[var(--surface-fg)]/30 transition-colors duration-400 group-hover:bg-[var(--surface-fg)]"
            />

            <h3 className="relative font-display text-[1.125rem] leading-snug font-medium tracking-[-0.015em] text-[var(--surface-fg)]">
              {step.label}
            </h3>
            <p className="relative mt-2.5 max-w-[32ch] text-[0.875rem] leading-[1.65] text-[var(--surface-muted)]">
              {step.body}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
