import Link from "next/link";
import { footerLinks } from "@/lib/navigation";
import { siteConfig, hasContactDetails } from "@/lib/site-config";
import { Logo } from "./logo";
import { Container } from "@/components/ui/section";

/* ============================================================
   FOOTER
   ------------------------------------------------------------
   Three columns: who, where, where else.

   WHY IT IS THREE AND NOT TWO
   The previous version put everything in columns 1-5 and the
   links alone in 9-12, which left a void down the middle of a
   1440px page and a taller void under the links. A footer that
   only occupies its left third reads as unfinished. The
   columns now divide the content by kind, and each one fills.

   THE FOOTER OWNS THE POSTAL ADDRESS
   It is the only place on the site that prints it. The
   homepage contact block and the contact page show the email
   and the phone — the two things a visitor can act on — and
   stop there, because the footer sits a couple of hundred
   pixels below both and printing the address twice inside one
   viewport is what it looks like: a mistake.

   WHAT IS STILL DELIBERATELY ABSENT
   Social icons and a legal menu. An earlier revision invented
   both and pointed them at "#". `social` stays empty until an
   account exists, and the legal pages are not written yet — a
   footer with four working links beats one with twelve where
   eight go nowhere.

   Every block is gated on its value being present, so clearing
   a field in siteConfig hides its row rather than leaving a
   label with nothing under it.
   ============================================================ */

const COLUMN_LABEL = "mono-label text-[var(--surface-muted)]";
const QUIET_LINK =
  "text-[var(--surface-muted)] underline decoration-[var(--surface-rule)] " +
  "underline-offset-4 transition-colors hover:text-[var(--surface-fg)] " +
  "hover:decoration-[var(--surface-fg)]";

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer data-surface="ink" className="relative isolate">
      <Container>
        {/* Side by side on a phone rather than one long stack —
            stacked, these two alone ran past a full screen. The
            split is 3/2 rather than even: the address needs the
            width, the link list only needs its longest label. */}
        <div className="grid grid-cols-5 gap-x-6 gap-y-9 border-t border-[var(--surface-rule)] py-12 lg:grid-cols-12 lg:py-14 lg:gap-x-12">
          {/* --- who ------------------------------------- */}
          <div className="col-span-5 lg:col-span-4">
            <Link href="/" aria-label={`${siteConfig.name} — home`}>
              <Logo width="w-[128px]" />
            </Link>

            <p className="mt-5 max-w-[30ch] text-[0.9375rem] leading-relaxed text-[var(--surface-muted)]">
              {siteConfig.statement}
            </p>
          </div>

          {/* --- where ----------------------------------- */}
          {hasContactDetails ? (
            <div className="col-span-3 lg:col-span-4 lg:col-start-6">
              <h2 className={COLUMN_LABEL}>Contact</h2>

              {contact.addressLines.length ? (
                <address className="mt-5 text-[0.875rem] leading-[1.7] text-[var(--surface-muted)] not-italic">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              ) : null}

              <div className="mt-4 flex flex-col gap-1.5 text-[0.875rem]">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className={QUIET_LINK}>
                    {contact.email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phoneHref}`} className={QUIET_LINK}>
                    {contact.phone}
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* --- where else ------------------------------ */}
          <nav aria-label="Footer" className="col-span-2 lg:col-span-3 lg:col-start-10">
            <h2 className={COLUMN_LABEL}>Site</h2>

            {/* A column, not a right-aligned row. The row floated
                alone against the top edge with nothing under it. */}
            <ul className="mt-5 flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex text-[0.875rem] text-[var(--surface-muted)] transition-colors hover:text-[var(--surface-fg)]"
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

        {/* --- the bottom bar ---------------------------- */}
        <div className="flex flex-col gap-y-2 border-t border-[var(--surface-rule)] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-x-8">
          <p className="text-[0.8125rem] text-[var(--surface-muted)]">
            © {siteConfig.legal.copyrightFrom}
            {year > siteConfig.legal.copyrightFrom ? `–${year}` : ""}{" "}
            {siteConfig.legal.entity}
          </p>
          <p className="max-w-[52ch] text-[0.75rem] leading-[1.5] text-[var(--surface-muted)] sm:text-right">
            Interface mockups shown on this site are illustrative concepts, not
            commercial products.
          </p>
        </div>
      </Container>
    </footer>
  );
}
