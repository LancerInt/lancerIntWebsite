import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/ui/section";
import { PrimaryAction } from "@/components/ui/actions";
import { ArrowRight } from "@/components/icons";
import { navLinks } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/* ============================================================
   404
   ------------------------------------------------------------
   An error screen is a navigation problem, not a joke. It says
   what happened and offers the routes that do exist.
   ============================================================ */

export default function NotFound() {
  return (
    <section
      data-surface="ink"
      className="top-light relative isolate flex min-h-dvh flex-col justify-center pt-24 pb-16"
    >
      <Container className="relative z-1">
        <p className="eyebrow">Error · 404</p>

        <h1 className="text-d1 mt-6 max-w-3xl font-display text-vellum">
          This page doesn&rsquo;t <span className="accent-italic">exist</span>.
        </h1>

        <p className="text-lead mt-6 max-w-[46ch] text-sage">
          The address resolved, but there is nothing published at it. The link
          may be out of date.
        </p>

        <div className="mt-9">
          <PrimaryAction href="/" size="lg">
            Back to the homepage
          </PrimaryAction>
        </div>

        <nav aria-label="Main sections" className="mt-14">
          <p className="text-[0.75rem] tracking-[0.14em] text-sage uppercase">
            Or try one of these
          </p>
          <ul className="mt-5 border-t border-[var(--surface-rule)]">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-[var(--surface-rule)]">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="font-display text-[1.0625rem] font-medium text-vellum">
                    {link.label}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-sage transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
