import { AnimatedText } from "@/components/ui/animated-text";
import { PrimaryAction, ArrowLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CursorMark } from "@/components/system/cursor-mark";
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
          <div className="lg:col-span-7">
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
              className="text-hero mt-6 font-display text-[var(--surface-fg)]"
              lineClassName="pb-[0.02em]"
            />

            <Reveal delay={400} distance={12}>
              <p className="text-lead mt-7 max-w-[46ch] text-[var(--surface-muted)]">
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

          {/* --- the mark ---------------------------------
              The reference opens with its brand mark rendered
              in metal and lets the product appear further down.
              Same order here: the monogram holds the hero, the
              CRM view moves to the capability section where it
              has something to illustrate. */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <Reveal delay={220} distance={16}>
              <CursorMark size={360} />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
