import { AnimatedText } from "@/components/ui/animated-text";
import { CursorIcon } from "@/components/system/cursor-icon";
import { PrimaryAction } from "@/components/ui/actions";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { productDirection } from "@/lib/content";

/* ============================================================
   06 · PRODUCT DIRECTION
   ------------------------------------------------------------
   A statement of direction, not an announcement.

   What is deliberately absent: a product name, a logo, a
   screenshot, a feature list, a waitlist, a launch date, a
   version number. Any one of those would turn an honest
   "we are paying attention to this" into a claim that
   something exists.

   What is present instead: the recurring problems we keep
   seeing, listed plainly. That is genuinely what this stage
   looks like, and it reads as work in progress with a purpose
   rather than a teaser for vapourware.

   The dashed rule and the unfilled markers carry the
   unfinished quality — the only place on the site that uses
   them, which is what makes them mean something here.
   ============================================================ */

export function ProductDirection() {
  return (
    <Section id="product-direction" surface="ink" size="lg" divider>
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        {/* --- statement -------------------------------- */}
        <div className="lg:col-span-6">
          <Reveal distance={10}>
            <CursorIcon shape="stack" className="mb-5" />
            <p className="eyebrow">{productDirection.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...productDirection.lines]}
            accentWord={productDirection.accent}
            className="text-d1 mt-6 font-display text-[var(--surface-fg)]"
            lineClassName="pb-[0.02em]"
          />

          <Reveal delay={180}>
            <div className="mt-7 max-w-[48ch] space-y-5">
              {productDirection.paragraphs.map((p, i) => (
                <p key={i} className="text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)]">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-9">
              <PrimaryAction href={productDirection.cta.href}>
                {productDirection.cta.label}
              </PrimaryAction>
            </div>
          </Reveal>
        </div>

        {/* --- what we keep seeing ---------------------- */}
        <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-2xl border border-dashed border-[var(--surface-rule)] px-6 py-7 sm:px-7">
            <p className="text-[0.75rem] tracking-[0.14em] text-[var(--surface-muted)] uppercase">
              Problems we keep running into
            </p>

            <ul className="mt-6 space-y-4">
              {productDirection.themes.map((theme) => (
                <li key={theme} className="flex items-start gap-3.5">
                  {/* unfilled marker — nothing here is finished */}
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] size-[7px] shrink-0 rounded-full border border-[var(--surface-fg)]/40"
                  />
                  <span className="text-[0.9375rem] leading-[1.6] text-[var(--surface-fg)]">
                    {theme}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-7 border-t border-dashed border-[var(--surface-rule)] pt-5 text-[0.8125rem] leading-relaxed text-[var(--surface-muted)]">
              Nothing here is a released product. If that changes, this section
              will say so plainly.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
