import type { Metadata } from "next";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { PrimaryAction } from "@/components/ui/actions";
import { about, capabilities } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lancer International is a growing team building CRM, ERP and custom business software with a practical view of technology.",
  alternates: { canonical: "/about" },
};

/* ============================================================
   /about
   ------------------------------------------------------------
   Short on purpose.

   There is no founding year, headcount, office, leadership
   team or company history here, because none of those facts
   are established and the brief forbids inventing them. What
   is here is what is true: what we build, how we think about
   it, and where we are going.

   When verified details exist they belong in siteConfig and a
   new block here — not scattered through the copy.
   ============================================================ */

const beliefs = [
  {
    title: "Understand before building",
    body: "The first job is working out how the process actually runs today, including the parts that only exist in someone's head.",
  },
  {
    title: "Start small, stay useful",
    body: "A focused tool that solves one real problem beats a large system that solves none of them well.",
  },
  {
    title: "Build what can be maintained",
    body: "Software is read far more often than it is written. We favour approaches another developer can pick up.",
  },
  {
    title: "Say what we know",
    body: "If something is uncertain, a guess, or not yet decided, we would rather say so than present it as settled.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* --- opening ---------------------------------- */}
      <section
        data-surface="ink"
        className="top-light relative isolate overflow-hidden"
      >
        <div className="mx-auto w-full max-w-[var(--page-max)] px-5 pt-32 pb-20 sm:px-6 sm:pt-36 lg:px-10 lg:pt-40 lg:pb-28 xl:px-14">
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal distance={10}>
                <p className="eyebrow">{about.eyebrow}</p>
              </Reveal>

              <AnimatedText
                as="h1"
                lines={[...about.lines]}
                accentWord={about.accent}
                className="text-d1 mt-6 font-display text-[var(--surface-fg)]"
                lineClassName="pb-[0.02em]"
              />
            </div>

            <Reveal delay={200} className="lg:col-span-5 lg:col-start-8 lg:pt-6">
              <div className="space-y-5">
                {about.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- how we think ----------------------------- */}
      <Section surface="light" size="lg">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">How we think about the work</p>
            <h2 className="text-d2 mt-6 font-display">
              Four things we hold to.
            </h2>
          </div>

          <ol className="lg:col-span-7 lg:col-start-6">
            {beliefs.map((b, i) => (
              <Reveal
                as="li"
                key={b.title}
                delay={i * 60}
                distance={12}
                className="group relative border-t border-[var(--surface-rule)] py-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-12 origin-left scale-x-0 bg-[var(--surface-accent-strong)] transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-x-100"
                />
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[0.8125rem] font-medium tracking-[0.1em] text-[var(--surface-accent-strong)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[1.125rem] leading-snug font-medium tracking-[-0.015em]">
                    {b.title}
                  </h3>
                </div>
                <p className="mt-2.5 max-w-[56ch] text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)]">
                  {b.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* --- what we build ---------------------------- */}
      <Section surface="paper" size="md">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">What we build</p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:col-span-8">
            {capabilities.map((c) => (
              <li
                key={c.index}
                className="rounded-full border border-[var(--surface-rule)] bg-[var(--surface-panel)] px-4 py-2 text-[0.875rem] text-[var(--surface-muted)]"
              >
                {c.title}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* --- next ------------------------------------- */}
      <Section surface="light" size="md">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <div>
            <h2 className="text-d3 font-display">
              Have a problem worth solving?
            </h2>
            <p className="mt-2 max-w-[44ch] text-[0.9375rem] text-[var(--surface-muted)]">
              {siteConfig.statement}
            </p>
          </div>
          <PrimaryAction href="/contact" size="lg">
            Discuss a Project
          </PrimaryAction>
        </div>
      </Section>
    </>
  );
}
