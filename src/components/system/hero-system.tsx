"use client";

import { useEffect, useRef, useState } from "react";
import { demoInterface as ui } from "@/lib/demo-interface";
import { usePrefersReducedMotion } from "@/components/ui/reveal";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ============================================================
   HERO WINDOW
   ------------------------------------------------------------
   One CRM pipeline view, rendered as a real interface rather
   than a screenshot — sidebar, metric row, stage breakdown and
   an enquiry list.

   It carries an "Illustrative" tag in its own chrome. That tag
   is not decoration: the brief is clear that interface mockups
   must be visibly separated from actual available offerings,
   and a dashboard with no label reads as a product.

   CURSOR 3D
   The window sits in a perspective container and rotates on
   both axes under the pointer — real CSS 3D, not a flat
   translate. Two reasons it is done this way:

   · No dependency. A WebGL canvas for one tilting rectangle
     would be a megabyte of runtime for an effect that is six
     lines of transform.
   · It is interruptible and cheap. One rAF-throttled
     pointermove writing one transform, composited off the
     main thread, nothing animating at rest.

   Rotation is capped at 5°. Past roughly 7° the text inside
   starts to shear visibly and the interface stops reading as
   software. Mouse only, and off entirely under reduced motion.
   ============================================================ */

/** Degrees of rotation at the far edge of the container. */
const TILT = 5;

const stageTotal = ui.stages.reduce((n, s) => n + s.count, 0);

export function HeroWindow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = node.getBoundingClientRect();
        setTilt({
          x: (e.clientX - r.left) / r.width - 0.5,
          y: (e.clientY - r.top) / r.height - 0.5,
        });
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      role="img"
      aria-label={`Illustrative CRM pipeline interface: ${ui.tiles
        .map((t) => `${t.label} ${t.value}`)
        .join(", ")}, with enquiries across ${ui.stages.length} stages.`}
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
    >
      <div
        data-surface="graphite"
        /* 10.5rem, not 9 — "Customer pipeline" truncated at the
           narrower sidebar width */
        className="panel grid overflow-hidden rounded-2xl sm:grid-cols-[10.5rem_minmax(0,1fr)]"
        style={{
          transform: `rotateY(${tilt.x * TILT * 2}deg) rotateX(${-tilt.y * TILT * 2}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: "transform 600ms var(--ease-out-quint)",
          willChange: "transform",
        }}
      >
        {/* --- sidebar -------------------------------- */}
        <div className="hidden flex-col border-r border-[var(--surface-rule)] bg-[var(--surface-sunken)]/45 p-2.5 sm:flex">
          <p className="truncate px-2 pt-1 pb-3 font-display text-[0.8125rem] font-medium">
            {ui.appName}
          </p>
          <ul className="space-y-0.5">
            {ui.nav.map((item, i) => (
              <li key={item.label}>
                <span
                  className={cn(
                    "flex min-h-8 items-center gap-2 rounded-md px-2 text-[0.75rem]",
                    i === 2 ? "bg-[var(--surface-panel)] text-[var(--surface-fg)]" : "text-[var(--surface-muted)]",
                  )}
                >
                  <Icon name={item.icon} className="size-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{item.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- main ----------------------------------- */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--surface-rule)] px-4 py-3">
            <span className="truncate font-display text-[0.8125rem] font-medium">
              {ui.heading}
            </span>
            {/* says what this is, in the interface itself */}
            <span className="shrink-0 rounded-full border border-[var(--surface-rule)] px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.08em] text-[var(--surface-muted)] uppercase">
              Illustrative
            </span>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-[var(--surface-rule)] border-b border-[var(--surface-rule)]">
            {ui.tiles.map((tile) => (
              <div key={tile.label} className="px-3 py-3.5 sm:px-4">
                <dt className="truncate text-[0.6875rem] text-[var(--surface-muted)]">
                  {tile.label}
                </dt>
                <dd>
                  <span
                    data-numeric
                    className="mt-1.5 block font-display text-[1.25rem] leading-none font-medium tracking-[-0.02em] sm:text-[1.5rem]"
                  >
                    {tile.value}
                  </span>
                  {tile.delta ? (
                    <span className="mt-1.5 block text-[0.6875rem] text-[var(--surface-fg)]">
                      {tile.delta}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          {/* --- pipeline stages ---------------------- */}
          <div className="border-b border-[var(--surface-rule)] px-4 pt-4 pb-5">
            <p className="text-[0.6875rem] text-[var(--surface-muted)]">By stage</p>

            <div
              aria-hidden="true"
              className="mt-3 flex gap-1 overflow-hidden rounded-full"
            >
              {ui.stages.map((s, i) => (
                <span
                  key={s.label}
                  className={cn(
                    "h-2 rounded-full",
                    i === ui.stages.length - 1 ? "bg-[var(--surface-fg)]" : "bg-[var(--surface-fg)]/22",
                  )}
                  style={{
                    width: `${(s.count / stageTotal) * 100}%`,
                    transformOrigin: "left",
                    animation: reduce
                      ? undefined
                      : `coverage-in 600ms var(--ease-out-quint) ${200 + i * 90}ms both`,
                  }}
                />
              ))}
            </div>

            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {ui.stages.map((s, i) => (
                <li
                  key={s.label}
                  className="flex items-center gap-1.5 text-[0.6875rem] text-[var(--surface-muted)]"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full",
                      i === ui.stages.length - 1 ? "bg-[var(--surface-fg)]" : "bg-[var(--surface-fg)]/22",
                    )}
                  />
                  {s.label}
                  <span data-numeric className="text-[var(--surface-fg)]">
                    {s.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* --- enquiries ---------------------------- */}
          <ul className="divide-y divide-[var(--surface-rule)]">
            {ui.rows.map((row) => (
              <li
                key={row.ref}
                className="flex items-center gap-3 px-4 py-2.5 text-[0.6875rem]"
              >
                <span data-numeric className="shrink-0 text-[var(--surface-muted)]">
                  {row.ref}
                </span>
                <span className="min-w-0 flex-1 truncate text-[var(--surface-fg)]">
                  {row.name}
                </span>
                <span className="hidden shrink-0 text-[var(--surface-muted)] sm:inline">
                  {row.stage}
                </span>
                <span className="shrink-0 text-[var(--surface-muted)]">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
