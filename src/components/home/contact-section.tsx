import { AnimatedText } from "@/components/ui/animated-text";
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
            <p className="eyebrow">{contact.eyebrow}</p>
          </Reveal>

          <AnimatedText
            as="h2"
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

          {/* Renders only once real details exist. */}
          {hasContactDetails ? (
            <Reveal delay={260}>
              <dl className="mt-10 space-y-4">
                {siteConfig.contact.email ? (
                  <div>
                    <dt className="text-[0.75rem] text-sage">Email</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-[0.9375rem] text-vellum underline decoration-[var(--surface-rule)] underline-offset-4 hover:decoration-[var(--surface-fg)]"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {siteConfig.contact.phone ? (
                  <div>
                    <dt className="text-[0.75rem] text-sage">Phone</dt>
                    <dd className="mt-1 text-[0.9375rem] text-vellum">
                      {siteConfig.contact.phone}
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
