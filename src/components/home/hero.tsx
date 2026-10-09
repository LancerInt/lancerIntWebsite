import { AnimatedText } from "@/components/ui/animated-text";
import { PrimaryAction, ArrowLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { HeroWindow } from "@/components/system/hero-system";
import { hero } from "@/lib/content";

/* ============================================================
   01 · HERO
   ------------------------------------------------------------
   One statement, one software visual, one primary action.

   The architectural photograph behind rev 3's hero is gone. It
   was carrying a "large established firm" impression that the
   positioning does not support, and it competed with the
   interface for attention. A near-black ground with a single
   soft light reads as considered rather than corporate, and
   puts the whole focal weight on the pipeline view.
   ============================================================ */

export function Hero() {
  return (
    <section
      data-surface="ink"
      className="top-light relative isolate overflow-hidden"
    >
      <Container className="relative z-1">
        <div className="grid items-center gap-x-12 gap-y-14 pt-28 pb-16 sm:pt-32 lg:grid-cols-12 lg:gap-x-16 lg:pt-36 lg:pb-24">
          {/* --- statement -------------------------------- */}
          <div className="lg:col-span-5">
            {/* a bordered pill, not a letterspaced label — the
                reference opens with one small badge above the
                headline and no accent colour anywhere near it */}
            <Reveal distance={10}>
              <p className="badge">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-[var(--surface-fg)]"
                />
                {hero.eyebrow}
              </p>
            </Reveal>

            <AnimatedText
              as="h1"
              lines={[...hero.lines]}
              accentWord={hero.accent}
              className="text-hero mt-6 font-display text-vellum"
              lineClassName="pb-[0.02em]"
            />

            <Reveal delay={400} distance={12}>
              <p className="text-lead mt-7 max-w-[46ch] text-sage">
                {hero.body}
              </p>
            </Reveal>

            <Reveal delay={500} distance={12}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                <PrimaryAction href={hero.primary.href} size="lg">
                  {hero.primary.label}
                </PrimaryAction>
                <ArrowLink href={hero.secondary.href}>
                  {hero.secondary.label}
                </ArrowLink>
              </div>
            </Reveal>
          </div>

          {/* --- the software ----------------------------- */}
          <div className="lg:col-span-7 lg:-mr-4 xl:-mr-10">
            <Reveal delay={220} distance={16}>
              <HeroWindow />
            </Reveal>

            <Reveal delay={320}>
              <p className="mt-4 text-[0.75rem] text-sage">
                An illustrative interface showing the kind of system we build.
                Not a commercial product, and the data is invented.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
