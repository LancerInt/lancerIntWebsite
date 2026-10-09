import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { Capabilities } from "@/components/home/capabilities";
import { HowWeWork } from "@/components/home/how-we-work";
import { Approach } from "@/components/home/approach";
import { ProductDirection } from "@/components/home/product-direction";
import { About } from "@/components/home/about";
import { ContactSection } from "@/components/home/contact-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Lancer International | CRM, ERP & Custom Business Software",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/* ============================================================
   HOMEPAGE
   ------------------------------------------------------------
   Eight sections, in the briefed order:

     hero → challenges → capabilities → how we work →
     approach → product direction → about → contact

   Rev 4 had fifteen, including an eight-page product portfolio,
   fabricated case-study metrics, a global delivery map and a
   page of engineering claims. All of it asserted a company
   considerably larger and further along than this one, so all
   of it is gone rather than restyled.

   SURFACE: a near-black ground, with one exception.

   Rev 5 alternated dark and ivory every section. It now runs
   near-black throughout except `Our approach`, which stays
   ivory. One light band in an otherwise dark page stops being
   an alternation and becomes the emphasis moment — and it is
   the right section to emphasise, because it carries the
   iteration loop.

   `How we work` uses `forest` rather than `ink`: one small
   lift inside the dark run so it does not read as a
   continuation of the capability list above it.

   Where two sections share a ground, the boundary is a
   full-bleed hairline (`divider`) instead of a colour change.

   ink · ink · ink · forest · LIGHT · ink · ink · ink
   ============================================================ */

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Capabilities />
      <HowWeWork />
      <Approach />
      <ProductDirection />
      <About />
      <ContactSection />
    </>
  );
}
