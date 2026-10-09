/* ============================================================
   NAVIGATION
   ------------------------------------------------------------
   Five links and one call to action. No dropdowns.

   Rev 3 had a four-section mega menu fronting a Products
   dropdown with eight product pages behind it. There is no
   product to put in a Products menu, so the menu is gone and
   so are the pages. A submenu is a promise that there is more
   underneath; here there isn't, and pretending otherwise was
   the single biggest overstatement on the site.

   The first three are homepage sections, the last two are
   pages. Both kinds live in one list so the masthead and the
   footer stay in step.
   ============================================================ */

export type NavLink = {
  label: string;
  href: string;
  /** True when the target is a section of the homepage. */
  anchor?: boolean;
};

export const navLinks: NavLink[] = [
  { label: "What We Do", href: "/#what-we-do", anchor: true },
  { label: "How We Work", href: "/#how-we-work", anchor: true },
  { label: "Our Approach", href: "/#our-approach", anchor: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta = { label: "Discuss a Project", href: "/contact" };

/** The footer repeats the four orientation links, not all five. */
export const footerLinks: NavLink[] = [
  { label: "What We Do", href: "/#what-we-do", anchor: true },
  { label: "How We Work", href: "/#how-we-work", anchor: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
