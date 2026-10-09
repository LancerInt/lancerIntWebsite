"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/icons";
import { usePrefersReducedMotion } from "./reveal";

/* ============================================================
   ACTIONS  ·  rev 4
   ------------------------------------------------------------
   8px-radius solids, not pills. The strong action flips colour
   with the ground — light-on-dark here — which is what
   `--surface-cta-bg` / `--surface-cta-fg` carry, so a component
   never specifies which.

   The arrow is inline at the label's size. Rev 3 put it in its
   own tinted disc, which added a second shape to a control that
   only needs one.
   ============================================================ */

const base =
  "group relative inline-flex items-center justify-center rounded-lg " +
  "font-display font-medium tracking-[-0.005em] whitespace-nowrap " +
  "transition-[background-color,border-color,box-shadow,transform,color] " +
  "duration-200 ease-[var(--ease-out-quint)] " +
  "disabled:pointer-events-none disabled:opacity-55";

const sizes = {
  sm: "min-h-9 gap-2 px-4 text-[0.8125rem]",
  md: "min-h-11 gap-2 px-5 text-[0.875rem]",
  lg: "min-h-12 gap-2.5 px-6 text-[0.9375rem]",
} as const;

/** Sizes for controls with no trailing disc. */
const plainSizes = {
  sm: "min-h-9 gap-2 px-4 text-[0.8125rem]",
  md: "min-h-11 gap-2.5 px-5 text-[0.875rem]",
  lg: "min-h-12 gap-3 px-6 text-[0.9375rem]",
} as const;

type Size = keyof typeof sizes;

/* ------------------------------------------------------------
   Filled — the strong action.
   ------------------------------------------------------------ */

export function PrimaryAction({
  href,
  children,
  className,
  size = "md",
  magnetic = true,
  arrow = true,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: Size;
  magnetic?: boolean;
  arrow?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Magnet enabled={magnetic}>
      <Link
        href={href}
        className={cn(
          base,
          arrow ? sizes[size] : plainSizes[size],
          "bg-[var(--surface-cta-bg)] text-[var(--surface-cta-fg)]",
          "shadow-[var(--btn-lift)]",
          "hover:-translate-y-px hover:shadow-[var(--btn-lift-hover)]",
          "hover:brightness-[1.06] active:translate-y-0",
          className,
        )}
        {...rest}
      >
        <span>{children}</span>
        {arrow ? (
          <ArrowRight className="size-3.5 shrink-0 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-0.5" />
        ) : null}
      </Link>
    </Magnet>
  );
}

/* ------------------------------------------------------------
   Outlined — the quiet pill used in the masthead.
   ------------------------------------------------------------ */

export function SecondaryAction({
  href,
  children,
  className,
  size = "md",
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: Size;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        plainSizes[size],
        "border border-[var(--surface-fg)]/22 bg-transparent",
        "hover:border-[var(--surface-fg)]/45 hover:bg-[var(--surface-fg)]/[0.04]",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------
   Accent — the terminal action. Monochrome now: it is the
   same fill as the primary, kept as a separate export so the
   submit/footer CTA can diverge later without a sweep.
   ------------------------------------------------------------ */

export function AccentAction({
  href,
  children,
  className,
  size = "lg",
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: Size;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      data-cursor="OPEN"
      className={cn(
        base,
        sizes[size],
        "bg-[var(--surface-cta-bg)] text-[var(--surface-cta-fg)] shadow-[var(--btn-lift)]",
        "hover:-translate-y-px hover:brightness-[0.94]",
        "hover:shadow-[var(--btn-lift-hover)] active:translate-y-0",
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      <ArrowRight className="size-3.5 shrink-0 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ------------------------------------------------------------
   Inline arrow link — "Talk to our team", "View features".
   ------------------------------------------------------------ */

export function ArrowLink({
  href,
  children,
  className,
  kicker,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  kicker?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-10 items-center gap-2 text-[0.875rem]",
        className,
      )}
    >
      {kicker ? (
        <span className="mono-label text-[var(--surface-muted)]">{kicker}</span>
      ) : null}
      <span className="relative font-display font-medium tracking-[-0.005em]">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:scale-x-100"
        />
      </span>
      <ArrowRight className="size-3.5 shrink-0 transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-1" />
    </Link>
  );
}

/* ------------------------------------------------------------
   Magnet — a 6px pull toward the cursor. Mouse only, off under
   reduced motion, transform-only so it never triggers layout.
   ------------------------------------------------------------ */

function Magnet({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = usePrefersReducedMotion();

  if (!enabled || reduce) return <>{children}</>;

  return (
    <span
      ref={ref}
      className="inline-block"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: "transform 400ms var(--ease-out-quint)",
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        setOffset({ x: (dx / rect.width) * 6, y: (dy / rect.height) * 6 });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </span>
  );
}
