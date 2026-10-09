import { AnimatedText } from "@/components/ui/animated-text";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ArrowRight } from "@/components/icons";
import { approach } from "@/lib/content";

/* ============================================================
   05 · OUR APPROACH
   ------------------------------------------------------------
   The copy describes a loop — essentials, test against the real
   workflow, refine, repeat — so the one diagram on the page
   draws that loop and nothing else.

   It is three labelled stages and a return path, built from
   real elements rather than an SVG schematic, so the labels are
   selectable text at the page's own type scale and it reflows
   on a phone instead of shrinking.

   No claim about proprietary technology, methodology or team
   size appears here. The loop is the claim.
   ============================================================ */

const loop = [
  { label: "Start with the essentials", note: "The smallest version that solves the problem" },
  { label: "Test against real work", note: "Put it in front of the actual workflow" },
  { label: "Refine", note: "Improve as the requirements become clearer" },
];

export function Approach() {
  return (
    <Section id="our-approach" surface="light" size="lg">
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
        {/* --- statement -------------------------------- */}
        <div className="lg:col-span-6">
          <Reveal distance={10}>
            <p className="eyebrow">{approach.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...approach.lines]}
            accentWord={approach.accent}
            className="text-d1 mt-6 font-display"
            lineClassName="pb-[0.02em]"
          />
        </div>

        <Reveal delay={160} className="lg:col-span-5 lg:col-start-8 lg:pt-14">
          <div className="space-y-5">
            {approach.paragraphs.map((p, i) => (
              <p key={i} className="text-[0.9375rem] leading-[1.7] text-stone">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      {/* --- the loop ----------------------------------- */}
      <Reveal delay={120} className="mt-14 lg:mt-20">
        <ol className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-0">
          {loop.map((stage, i) => (
            <li key={stage.label} className="contents">
              <div className="panel flex flex-col justify-between rounded-xl px-5 py-5 sm:px-6 sm:py-6">
                <span className="font-display text-[0.8125rem] font-medium tracking-[0.1em] text-[var(--surface-accent-strong)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-6">
                  <h3 className="font-display text-[1.0625rem] leading-snug font-medium tracking-[-0.012em]">
                    {stage.label}
                  </h3>
                  <p className="mt-2 max-w-[30ch] text-[0.875rem] leading-[1.6] text-stone">
                    {stage.note}
                  </p>
                </div>
              </div>

              {/* connector, desktop only */}
              {i < loop.length - 1 ? (
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-center px-4 lg:flex"
                >
                  <ArrowRight className="size-4 text-[var(--surface-accent-strong)] opacity-55" />
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        {/* the return path — what makes it a loop rather
            than a three-step timeline */}
        <div
          className="mt-4 flex items-center gap-4 rounded-xl border border-dashed border-[var(--surface-rule)] px-5 py-3.5"
          aria-label="And repeat, as requirements become clearer"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0 text-[var(--surface-accent-strong)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M20 11a8 8 0 1 0-.7 3.3" />
            <path d="M20 5v6h-6" />
          </svg>
          <p className="text-[0.875rem] text-stone">
            Then again — each pass informed by what the last one revealed.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
