import { AnimatedText } from "@/components/ui/animated-text";
import { CursorIcon } from "@/components/system/cursor-icon";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import { HeroWindow } from "@/components/system/hero-system";
import { capabilities, capabilitiesIntro } from "@/lib/content";

/* ============================================================
   03 · WHAT WE DO
   ------------------------------------------------------------
   A numbered typographic list, explicitly not five identical
   cards.

   Each row is one line of the argument: a number, a name set
   at display size, and a plain description on the opposite
   measure. The only rule is the hairline between rows, and the
   only motion is a short accent segment drawn across it on
   hover.

   The icon is small and sits with the number rather than in a
   tile. A 40px icon tile per row is what turns a list back
   into a card grid.
   ============================================================ */

export function Capabilities() {
  return (
    <Section id="what-we-do" surface="ink" size="lg" divider>
      {/* --- opener ------------------------------------- */}
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal distance={10}>
            <CursorIcon shape="grid" className="mb-5" />
            <p className="eyebrow">{capabilitiesIntro.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...capabilitiesIntro.lines]}
            accentWord={capabilitiesIntro.accent}
            className="text-d1 mt-6 font-display"
            lineClassName="pb-[0.02em]"
          />
        </div>

        <Reveal delay={160} className="lg:col-span-5 lg:pt-14">
          <p className="max-w-[44ch] text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)]">
            {capabilitiesIntro.body}
          </p>
        </Reveal>
      </div>

      {/* --- the list ----------------------------------- */}
      <ol className="mt-14 border-t border-[var(--surface-rule)] lg:mt-20">
        {capabilities.map((c, i) => (
          <Reveal
            as="li"
            key={c.index}
            delay={i * 55}
            distance={14}
            className="group relative border-b border-[var(--surface-rule)]"
          >
            {/* the accent segment, drawn on the rule above */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-px w-16 origin-left scale-x-0 bg-[var(--surface-accent)] transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-100"
            />

            <div className="grid gap-x-12 gap-y-3 py-7 lg:grid-cols-12 lg:py-9">
              <div className="flex items-start gap-4 lg:col-span-5">
                <span className="mt-1.5 flex shrink-0 items-center gap-2.5">
                  <span className="font-display text-[0.8125rem] font-medium tracking-[0.1em] text-[var(--surface-accent-strong)]">
                    {c.index}
                  </span>
                  <Icon
                    name={c.icon}
                    className="size-4 text-[var(--surface-accent-strong)] opacity-70"
                    strokeWidth={1.4}
                  />
                </span>

                {/* 18px, down from 26px. The reference runs its
                    item titles at 15px and lets the section H2
                    carry the scale — the jump between the two is
                    what makes it read as dense rather than loud. */}
                <h3 className="font-display text-[1.125rem] leading-snug font-medium tracking-[-0.012em] transition-transform duration-500 ease-[var(--ease-out-quint)] lg:group-hover:translate-x-1">
                  {c.title}
                </h3>
              </div>

              <p className="max-w-[58ch] text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)] lg:col-span-7">
                {c.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* --- what one of these looks like ----------------
          The CRM view, moved down from the hero. It belongs
          here: beside the capability list it is an example of
          the first item rather than decoration. */}
      <div className="mt-20 lg:mt-28">
        <Reveal distance={16}>
          <HeroWindow />
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 text-center text-[0.75rem] text-[var(--surface-muted)]">
            An illustrative CRM pipeline, showing the kind of system we build.
            Not a commercial product, and the data is invented.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
