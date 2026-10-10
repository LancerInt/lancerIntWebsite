/* ============================================================
   siteConfig — COMPANY DETAILS
   ------------------------------------------------------------
   Deliberately sparse.

   An earlier revision carried a phone number, two email
   addresses, an office address and three social links, all
   invented and all pointing at "#". The rule has not changed:
   show a detail only when it is real, and never create a dead
   link or a fictional account.

   `contact` is now filled with verified details. `social` is
   still empty, and the footer renders nothing for it until an
   account actually exists — an entry with an empty href is
   skipped rather than rendered as a dead link.
   ============================================================ */

export const siteConfig = {
  name: "Lancer International",
  shortName: "Lancer",
  wordmark: { lead: "Lancer", trail: "International" },

  positioning: "Software · Business systems · Automation",
  statement: "Practical software. Thoughtful solutions.",

  description:
    "Lancer International builds CRM systems, ERP and business applications, workflow automation and custom software — designed around the way a business actually works.",

  /**
   * Production domain. Feeds metadataBase, the canonical and
   * OpenGraph URLs, robots.txt and sitemap.xml — so it has to be
   * the absolute origin crawlers will actually resolve, with no
   * trailing slash and no `www.` unless the host redirects to it.
   */
  url: "https://lancers.in",

  /**
   * Verified details. Components render a row only when its
   * value is a non-empty string, so clearing one hides it again
   * without touching a component.
   *
   * `phone` is the display form and `phoneHref` the dialable
   * one — a tel: URI has to be digits and a leading +, with no
   * spaces, or some dialers drop everything after the gap.
   */
  contact: {
    email: "info@lancers.in",
    phone: "+91 96777 07080",
    phoneHref: "+919677707080",
    addressLines: [
      "D.No. 310U, Muthuram Complex, 2nd Floor",
      "Brough Road",
      "Erode 638001",
      "Tamil Nadu, India",
    ] as string[],
    /** Structured for schema.org and for any future map link. */
    postal: {
      street: "D.No. 310U, Muthuram Complex, 2nd Floor, Brough Road",
      locality: "Erode",
      region: "Tamil Nadu",
      postalCode: "638001",
      country: "IN",
    },
  },

  /**
   * Same rule. Add `{ label, href }` once an account exists and
   * the footer will render it. An entry with an empty href is
   * ignored rather than rendered as a dead link.
   */
  social: [] as { label: string; href: string }[],

  legal: {
    entity: "Lancer International",
    copyrightFrom: 2026,
  },
} as const;

/** True when there is at least one real contact detail to show. */
export const hasContactDetails = Boolean(
  siteConfig.contact.email ||
    siteConfig.contact.phone ||
    siteConfig.contact.addressLines.length,
);

export type SiteConfig = typeof siteConfig;
