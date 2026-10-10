import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import { siteConfig, hasContactDetails } from "@/lib/site-config";
import { Logo } from "./logo";
import { Container } from "@/components/ui/section";

/* ============================================================
   FOOTER
   ------------------------------------------------------------
   Logo, strapline, four links, copyright.

   What is deliberately absent: social icons, a phone number,
   an office address and a legal menu. Every one of those was
   invented in rev 3 and pointed at "#". The brief rules out
   dead links and fictional accounts, and a footer with four
   working links is better than one with twelve where eight go
   nowhere.

   `hasContactDetails` gates the contact line. Fill siteConfig
   in and it appears; nothing here needs editing.
   ============================================================ */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="ink" className="relative isolate">
      <Container>
        <div className="grid gap-x-12 gap-y-10 border-t border-[var(--surface-rule)] py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label={`${siteConfig.name} — home`}>
              <Logo width="w-[128px]" />
            </Link>

            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-[var(--surface-muted)]">
              {siteConfig.statement}
            </p>

            {hasContactDetails ? (
              <div className="mt-5 space-y-2 text-[0.875rem]">
                {siteConfig.contact.addressLines.length ? (
                  <address className="leading-[1.6] text-[var(--surface-muted)] not-italic">
                    {siteConfig.contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                ) : null}

                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {siteConfig.contact.email ? (
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-[var(--surface-muted)] underline decoration-[var(--surface-rule)] underline-offset-4 transition-colors hover:text-[var(--surface-fg)] hover:decoration-[var(--surface-fg)]"
                    >
                      {siteConfig.contact.email}
                    </a>
                  ) : null}
                  {siteConfig.contact.phone ? (
                    <a
                      href={`tel:${siteConfig.contact.phoneHref}`}
                      className="text-[var(--surface-muted)] underline decoration-[var(--surface-rule)] underline-offset-4 transition-colors hover:text-[var(--surface-fg)] hover:decoration-[var(--surface-fg)]"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <nav
            aria-label="Footer"
            className="lg:col-span-4 lg:col-start-9"
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex min-h-9 items-center text-[0.875rem] text-[var(--surface-muted)] transition-colors hover:text-[var(--surface-fg)]"
                  >
                    <span className="relative">
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[var(--surface-fg)] transition-transform duration-300 group-hover:scale-x-100"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-[var(--surface-rule)] py-6">
          <p className="text-[0.8125rem] text-[var(--surface-muted)]">
            © {siteConfig.legal.copyrightFrom}
            {year > siteConfig.legal.copyrightFrom ? `–${year}` : ""}{" "}
            {siteConfig.legal.entity}
          </p>
          <p className="text-[0.75rem] text-[var(--surface-muted)]">
            Interface mockups shown on this site are illustrative concepts, not
            commercial products.
          </p>
        </div>
      </Container>
    </footer>
  );
}
