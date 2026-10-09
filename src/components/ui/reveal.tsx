"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   REVEAL
   ------------------------------------------------------------
   Scroll reveals, with the failure mode designed out.

   THE BUG THIS FIXES
   An IntersectionObserver only calls back when an element
   CROSSES a threshold. Drag the scrollbar, follow an in-page
   anchor, or restore a scroll position, and the viewport jumps
   straight past an element — it goes from "below the fold" to
   "above the fold" without ever intersecting, no callback
   fires, and the element stays at opacity 0 for the rest of the
   session. An audit of the built page found 82 elements stuck
   that way, including four product cards and the entire
   interactive demo.

   THE FIX
   One shared observer for efficiency, plus a debounced sweep
   after scrolling stops that reveals anything whose top has
   passed the viewport bottom. Belt and braces: a 2.5s failsafe
   reveals everything still pending, so no content can be
   permanently invisible even if both mechanisms fail.

   Content is also visible with no JS at all — a <noscript>
   rule in the root layout forces every [data-shown] element to
   its final state.
   ============================================================ */

type Release = () => void;

let observer: IntersectionObserver | null = null;
const pending = new Map<Element, () => void>();
let sweepTimer = 0;
let failsafeTimer = 0;
let listening = false;

function release(el: Element) {
  pending.delete(el);
  observer?.unobserve(el);
  if (pending.size === 0) stopListening();
}

/**
 * Reveal anything whose top has passed the viewport bottom.
 * This is what catches the jumped-past case the observer misses.
 */
function sweep() {
  const limit = window.innerHeight;
  for (const [el, show] of [...pending]) {
    if (el.getBoundingClientRect().top < limit) {
      show();
      release(el);
    }
  }
}

/** Last resort: nothing stays hidden, whatever went wrong. */
function revealEverything() {
  for (const [el, show] of [...pending]) {
    show();
    release(el);
  }
}

function onScroll() {
  window.clearTimeout(sweepTimer);
  sweepTimer = window.setTimeout(sweep, 120);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.clearTimeout(failsafeTimer);
  failsafeTimer = window.setTimeout(revealEverything, 2500);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  window.clearTimeout(sweepTimer);
  window.clearTimeout(failsafeTimer);
}

/** Registers an element; returns an unsubscribe. */
export function observeReveal(el: Element, show: () => void): Release {
  if (typeof IntersectionObserver === "undefined") {
    show();
    return () => {};
  }

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        pending.get(entry.target)?.();
        release(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
  );

  pending.set(el, show);
  observer.observe(el);
  startListening();

  /* An element already on screen at mount reveals on the next
     frame rather than waiting for a scroll that may never come. */
  requestAnimationFrame(() => {
    if (pending.has(el) && el.getBoundingClientRect().top < window.innerHeight) {
      show();
      release(el);
    }
  });

  return () => release(el);
}

/* ------------------------------------------------------------
   Reveal
   ------------------------------------------------------------ */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger in ms. Keep to 40–70ms steps. */
  delay?: number;
  distance?: number;
  as?: "div" | "li" | "span" | "section" | "tr";
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 16,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    return observeReveal(node, () => setShown(true));
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-shown={shown}
      className={cn("reveal-root", className)}
      style={
        {
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : `translateY(${distance}px)`,
          transition: `opacity 620ms var(--ease-out-quint) ${delay}ms, transform 620ms var(--ease-out-quint) ${delay}ms`,
          willChange: shown ? "auto" : "opacity, transform",
        } satisfies React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------
   useInView — same guarantees, for diagrams that draw on entry.
   ------------------------------------------------------------ */

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setInView(true));
  }, []);

  return { ref, inView };
}

/**
 * Reads the reduced-motion preference reactively.
 *
 * Starts `false` because the server has no media query to read,
 * and a `true` first render would make scroll-driven sections
 * mount at the wrong height and then jump once corrected. The
 * CSS @media rule is the real backstop.
 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(query.matches);
    const onChange = () => setReduce(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduce;
}
