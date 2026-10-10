import { AnimatedText } from "@/components/ui/animated-text";
import { CursorIcon } from "@/components/system/cursor-icon";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { contact } from "@/lib/content";
import { hasContactDetails, siteConfig } from "@/lib/site-config";

/* ============================================================
   08 · CONTACT
   ------------------------------------------------------------
   The statement and the form. Nothing else.

   Rev 3 printed a phone number, two email addresses, an office
   address and three social icons here — every one of them an
   invented placeholder, and the social links pointed at "#".
   They are gone. `hasContactDetails` is false until real values
   are filled into siteConfig, at which point this section
   starts rendering them without any edit here.
   ============================================================ */

export function ContactSection() {
  return (
    <Section id="contact" surface="ink" size="lg" divider className="top-light">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        {/* --- the invitation --------------------------- */}
        <div className="lg:col-span-5">
          <Reveal distance={10}>
            <CursorIcon shape="bubble" className="mb-5" />
            <p className="eyebrow">{contact.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
            lines={[...contact.lines]}
            accentWord={contact.accent}
            className="text-d1 mt-6 font-display text-[var(--surface-fg)]"
            lineClassName="pb-[0.02em]"
          />

          <Reveal delay={200}>
            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-[1.7] text-[var(--surface-muted)]">
              {contact.body}
            </p>
          </Reveal>

          {/* Email and phone only. The postal address lives in
              the footer, which is a short scroll below this and
              is the one place on the site that prints it. */}
          {hasContactDetails ? (
            <Reveal delay={260}>
              <dl className="mt-10 space-y-4">
                {siteConfig.contact.email ? (
                  <div>
                    <dt className="text-[0.75rem] text-[var(--surface-muted)]">Email</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-[0.9375rem] text-[var(--surface-fg)] underline decoration-[var(--surface-rule)] underline-offset-4 hover:decoration-[var(--surface-fg)]"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {siteConfig.contact.phone ? (
                  <div>
                    <dt className="text-[0.75rem] text-[var(--surface-muted)]">Phone</dt>
                    <dd className="mt-1">
                      {/* tel: wants digits and a leading +, with no
                          spaces — the display form keeps the spaces. */}
                      <a
                        href={`tel:${siteConfig.contact.phoneHref}`}
                        className="text-[0.9375rem] text-[var(--surface-fg)] underline decoration-[var(--surface-rule)] underline-offset-4 hover:decoration-[var(--surface-fg)]"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}

              </dl>
            </Reveal>
          ) : null}
        </div>

        {/* --- the form -------------------------------- */}
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
