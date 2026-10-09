"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks, primaryCta } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight } from "@/components/icons";
import { Logo } from "./logo";

/* ============================================================
   MOBILE MENU
   ------------------------------------------------------------
   Full screen, five links, one action. The accordion is gone
   with the submenus it was opening — there is nothing nested
   left to reveal, so every destination is one tap.

   Scroll locks, Escape closes, Tab is trapped inside, and
   focus moves in on open.
   ============================================================ */

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-surface="ink"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduce ? 0.001 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-200 flex flex-col overflow-y-auto lg:hidden"
        >
          <div className="flex h-20 shrink-0 items-center justify-between px-5 sm:px-6">
            <Link href="/" onClick={onClose} aria-label={`${siteConfig.name} — home`}>
              <Logo tone="light" width="w-[108px]" />
            </Link>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center rounded-full"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.25}
                aria-hidden="true"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <nav aria-label="Primary" className="flex-1 px-5 pb-10 sm:px-6">
            <ul className="border-t border-[var(--surface-rule)]">
              {navLinks.map((link) => (
                <li
                  key={link.href}
                  className="border-b border-[var(--surface-rule)]"
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 py-5 font-display text-[1.5rem] leading-none font-medium tracking-[-0.02em]"
                  >
                    {link.label}
                    <ArrowRight className="size-4 shrink-0 text-sage" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={primaryCta.href}
              onClick={onClose}
              className="group mt-8 flex min-h-14 items-center justify-between gap-4 rounded-lg bg-[var(--surface-fg)] px-6 text-ink shadow-[var(--btn-lift)]"
            >
              <span className="font-display text-base font-medium">
                {primaryCta.label}
              </span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>

            <p className="mt-8 text-[0.75rem] tracking-[0.1em] text-sage">
              {siteConfig.statement}
            </p>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
