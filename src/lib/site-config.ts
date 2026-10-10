/* ============================================================
   siteConfig — COMPANY DETAILS
   ------------------------------------------------------------
   Deliberately sparse.

   Rev 3 carried a phone number, two email addresses, an office
   address and three social links, all invented placeholders
   pointing at "#". The brief is explicit: show verified contact
   details and social accounts only when they exist, and never
   create a dead link or a fictional account.

   So they are gone. The contact form is the one real channel,
   and it is honest about where it goes. Fill `contact` and
   `social` in when the real values are known — every component
   that renders them already checks whether they are present.
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
   * Every field here is optional and currently empty. Components
   * render a contact row only when its value is a non-empty
   * string, so filling one in is the whole job — no component
   * needs editing.
   */
  contact: {
    email: "",
    phone: "",
    addressLines: [] as string[],
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
