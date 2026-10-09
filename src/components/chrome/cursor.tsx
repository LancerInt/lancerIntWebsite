"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/reveal";

/* ============================================================
   CURSOR
   ------------------------------------------------------------
   A 7px dot that expands into a labelled ring over anything
   carrying data-cursor="VIEW" | "OPEN" | …

   It reads the surface beneath it rather than using a blend
   mode. Blending with `difference` over a light section
   produced a purple that is nowhere in the palette and read as
   a rendering bug.

   Rather than branch on light-vs-dark in JS, it copies the
   nearest [data-surface] value onto itself and lets CSS resolve
   the tokens. That was already the better shape; now that the
   surfaces follow prefers-color-scheme it is the only correct
   one — "is this surface light?" has no fixed answer any more.

   Rules it follows: fine pointers only (never touch), never
   replaces the native cursor so the real one stays available
   for precision, off under reduced motion, and it does not
   capture a single pointer event.
   ============================================================ */

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [surface, setSurface] = useState<string | null>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) {
      setEnabled(false);
      return;
    }
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches);
    const onChange = () => setEnabled(fine.matches);
    fine.addEventListener("change", onChange);
    return () => fine.removeEventListener("change", onChange);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let x = -100;
    let y = -100;

    const render = () => {
      frame = 0;
      const node = dotRef.current;
      if (node) {
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        node.style.opacity = x < 0 ? "0" : "1";
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(render);

      const element = event.target as HTMLElement | null;
      if (!element?.closest) return;

      const interactive = element.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      setLabel(interactive?.dataset?.cursor ?? null);
      setActive(Boolean(interactive));

      const band = element.closest<HTMLElement>("[data-surface]");
      setSurface(band?.dataset.surface ?? null);
    };

    const onLeave = () => {
      x = -100;
      y = -100;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = label ? 60 : active ? 26 : 7;
  const ink = "var(--surface-accent-strong)";
  const hollow = Boolean(label || active);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-surface={surface ?? undefined}
      className="pointer-events-none fixed top-0 left-0 z-300 hidden !bg-transparent lg:block"
      /* Unpainted until the first pointermove gives it a real
         position. Rendering at 0,0 put a dot in the corner of
         the masthead on load, in every capture; parking it at
         -100px instead just moved the problem, since content
         off the left edge is what the layout audit looks for.
         Opacity costs nothing and is off the layout entirely.

         `!bg-transparent` is for data-surface: the base rule
         paints a ground on anything carrying one, and this
         element wants only the tokens. */
      style={{ opacity: 0 }}
    >
      <div
        className="flex items-center justify-center rounded-full border"
        style={{
          width: size,
          height: size,
          borderColor: ink,
          backgroundColor: hollow ? "transparent" : ink,
          transition:
            "width 320ms var(--ease-out-quint), height 320ms var(--ease-out-quint), background-color 200ms linear, border-color 200ms linear",
        }}
      >
        {label ? (
          <span
            className="mono-label"
            style={{ fontSize: 9, color: ink }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
