import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { ContactForm } from "@/components/contact/contact-form";
import { contact, processSteps } from "@/lib/content";
import { hasContactDetails, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Lancer International what you are trying to improve. We can start with a conversation about the problem and the options available.",
  alternates: { canonical: "/contact" },
};

/* ============================================================
   /contact
   ------------------------------------------------------------
   The same invitation as the homepage section, given a full
   page, plus a short note on how a project usually starts.

   No invented phone number, address or response-time promise.
   "Within two working days" sat on this page in rev 3 — that
   is a service commitment nobody has agreed to, so it is gone.
   ============================================================ */

export default function ContactPage() {
  return (
    <section
      data-surface="ink"
      className="top-light relative isolate min-h-dvh overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-32 pb-20 sm:px-6 sm:pt-36 lg:px-10 lg:pt-40 lg:pb-28">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          {/* --- invitation ---------------------------- */}
          <div className="lg:col-span-5">
            <Reveal distance={10}>
              <p className="eyebrow">{contact.eyebrow}</p>
            </Reveal>

            <AnimatedText
              as="h1"
              lines={[...contact.lines]}
              accentWord={contact.accent}
              className="text-d1 mt-6 font-display text-vellum"
              lineClassName="pb-[0.02em]"
            />

            <Reveal delay={200}>
              <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-[1.7] text-sage">
                {contact.body}
              </p>
            </Reveal>

            {/* --- how a project starts ---------------- */}
            <Reveal delay={260}>
              <p className="mt-12 text-[0.75rem] tracking-[0.14em] text-sage uppercase">
                How a project usually starts
              </p>
              <ol className="mt-5 border-t border-[var(--surface-rule)]">
                {processSteps.slice(0, 3).map((step) => (
                  <li
                    key={step.index}
                    className="flex items-baseline gap-4 border-b border-[var(--surface-rule)] py-3.5"
                  >
                    <span className="shrink-0 font-display text-[0.75rem] font-medium tracking-[0.1em] text-[var(--surface-muted)]">
                      {step.index}
                    </span>
                    <span className="text-[0.875rem] text-vellum/85">
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {hasContactDetails && siteConfig.contact.email ? (
              <Reveal delay={320}>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-8 inline-block text-[0.9375rem] text-vellum underline decoration-[var(--surface-rule)] underline-offset-4 hover:decoration-[var(--surface-fg)]"
                >
                  {siteConfig.contact.email}
                </a>
              </Reveal>
            ) : null}
          </div>

          {/* --- form --------------------------------- */}
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
