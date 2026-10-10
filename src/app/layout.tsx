import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Masthead } from "@/components/chrome/masthead";
import { Footer } from "@/components/chrome/footer";
import { Cursor } from "@/components/chrome/cursor";
import { siteConfig } from "@/lib/site-config";

/* ============================================================
   TYPE  ·  rev 2
   ------------------------------------------------------------
   One family, two roles.

   Host Grotesk — display AND body. A refined neo-grotesque with
     tight apertures and a slightly narrow stance; it holds up
     at 7rem set to -0.04em tracking and still reads cleanly at
     15px. Variable 300–800 plus italic, which is what lets the
     emphasis style be a voice shift rather than a second font.
   JetBrains Mono — genuine metadata only.

   Rev 1 shipped four families (Archivo, Instrument Sans, Plex
   Mono, Newsreader italic). The serif in particular pulled the
   whole site toward magazine; the premium software references
   all run one grotesque plus mono, and so does this now.
   ============================================================ */

/* Sora, variable. Only two weights are ever used — 400 for
   body and 500 for display — which is the reference's entire
   typographic range and most of why it reads as calm. */
const host = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-host",
});

/* Variable rather than static cuts, so mono-label can sit at
   450 — half a step up from body, which reads as deliberate
   rather than bold. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-jb",
});

/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Lancer International | Software, SaaS & Digital Systems",
    template: "%s | Lancer International",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Lancer International | Software, SaaS & Digital Systems",
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lancer International | Software, SaaS & Digital Systems",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* zoom is never disabled */
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${host.variable} ${mono.variable}`}
    >
      <head>
        {/*
          Scroll reveals set opacity/transform inline, which would
          leave the page blank if JS never arrives. With no script
          this forces every revealing element to its final state,
          so the site reads as a complete static document.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>
[data-shown],[data-reveal-line],[data-anim]{opacity:1!important;transform:none!important}
</style>`,
          }}
        />
      </head>
      <body>
        {/* Organization data, built from siteConfig so it cannot
            drift from what the page itself shows. Worth having
            now that the address and phone are verified — before
            that there was nothing truthful to put in it, and a
            fabricated LocalBusiness entry is worse than none.

            No aggregateRating, no founding date, no employee
            count: every one of those would be invented, and
            search engines treat invented markup as spam. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.legal.entity,
              url: siteConfig.url,
              description: siteConfig.description,
              email: siteConfig.contact.email,
              telephone: siteConfig.contact.phoneHref,
              address: {
                "@type": "PostalAddress",
                streetAddress: siteConfig.contact.postal.street,
                addressLocality: siteConfig.contact.postal.locality,
                addressRegion: siteConfig.contact.postal.region,
                postalCode: siteConfig.contact.postal.postalCode,
                addressCountry: siteConfig.contact.postal.country,
              },
            }),
          }}
        />

        <a href="#main" className="sr-focusable z-300 bg-[var(--surface-fg)] px-4 py-3 font-display text-sm font-medium text-[var(--surface-bg)]">
          Skip to main content
        </a>

        <Cursor />
        <Masthead />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
