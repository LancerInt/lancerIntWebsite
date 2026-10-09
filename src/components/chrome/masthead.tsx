"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, primaryCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

/* ============================================================
   MASTHEAD
   ------------------------------------------------------------
   Five links, one call to action, no dropdowns.

   The mega menu is gone with the product pages it fronted. A
   submenu advertises depth; with five destinations there is
   none to advertise, and the panel was the most overstated
   piece of chrome on the site.

   Transparent over the hero, then its own ground at 80% with
   a blur once scrolled. It carries data-surface="ink", so in a
   light scheme that bar is light and in a dark scheme it is
   dark — the logo and links follow from the same tokens and
   neither needs a branch.
   ============================================================ */

export function Masthead() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      {/* The scrolled bar is this surface's own ground at 80%,
          not a fixed colour — an ivory bar over near-black read
          as a bright slab rather than chrome, and a near-black
          one over an ivory page would read the same way. */}
      <header
        data-surface="ink"
        className={cn(
          "fixed inset-x-0 top-0 z-100",
          "transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled
            ? "border-b border-[var(--surface-rule)] bg-[color-mix(in_oklab,var(--surface-bg)_80%,transparent)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
        style={scrolled ? undefined : { backgroundColor: "transparent" }}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center gap-6 px-5 sm:px-8 lg:px-10">
          {/* --- logo -------------------------------------- */}
          <Link
            href="/"
            className="shrink-0"
            aria-label={`${siteConfig.name} — home`}
          >
            <Logo priority width="w-[108px] sm:w-[118px]" />
          </Link>

          {/* --- links ------------------------------------- */}
          <nav
            aria-label="Primary"
            className="hidden flex-1 justify-center lg:flex"
          >
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = !link.anchor && pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-9 items-center rounded-md px-3.5",
                        "font-display text-[0.875rem]",
                        "transition-colors duration-200 ease-out",
                        active
                          ? "text-[var(--surface-fg)]"
                          : "text-[var(--surface-muted)] hover:text-[var(--surface-fg)]",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* --- cta --------------------------------------- */}
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <Link
              href={primaryCta.href}
              className={cn(
                "hidden min-h-10 items-center rounded-lg px-5 sm:inline-flex",
                "bg-[var(--surface-cta-bg)] text-[var(--surface-cta-fg)]",
                "font-display text-[0.875rem] font-medium",
                "shadow-[var(--btn-lift)] transition-all duration-200 ease-out",
                "hover:-translate-y-px hover:shadow-[var(--btn-lift-hover)]",
              )}
            >
              {primaryCta.label}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-label="Open menu"
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-fg)]/[0.06] lg:hidden"
            >
              <span aria-hidden="true" className="flex w-[18px] flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
