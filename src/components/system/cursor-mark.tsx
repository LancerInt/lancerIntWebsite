"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/* ============================================================
   CURSOR MARK
   ------------------------------------------------------------
   The LI monogram rendered as brushed metal, lit by the cursor.

   HOW
   The supplied PNG has a clean alpha channel, so the glyph is
   used as a CSS mask rather than drawn. The element behind the
   mask is a metallic gradient stack; only the glyph shows
   through. Move the pointer and the gradient's light angle and
   specular band move with it, so the mark appears to catch
   light from wherever the cursor is.

   That is the whole trick: mask + moving gradient = chrome.
   No WebGL, no 3D asset pipeline, no second logo export. It
   also means swapping the brand mark is swapping one PNG.

   Used twice at two scales — once at hero size, and once as
   the small section marker, which is why this is a component
   and not inline styles.

   Decorative: aria-hidden, and static under reduced motion
   where it keeps a fixed top-left light.
   ============================================================ */

export function CursorMark({
  size = 320,
  className,
  /** The glyph used as the mask. */
  src = "/lancer-hero-logo-light.png",
}: {
  size?: number;
  className?: string;
  src?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState({ x: 34, y: 24 });
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = ref.current;
        if (!node) return;
        const r = node.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.6);
        const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.8);
        setLight({
          x: 50 + Math.max(-1, Math.min(1, dx)) * 46,
          y: 50 + Math.max(-1, Math.min(1, dy)) * 46,
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  /* The specular band runs perpendicular to the light, which is
     what separates brushed metal from a plain gradient fill. */
  const angle = 90 + (light.x - 50) * 1.6;

  const mask = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  } as const;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
    >
      {/* bloom thrown onto the ground behind the mark */}
      <div
        className="absolute -inset-[18%] rounded-full"
        style={{
          background: `radial-gradient(circle at ${light.x}% ${light.y}%, rgba(255,255,255,0.09), transparent 58%)`,
          transition: "background 450ms var(--ease-out-quint)",
        }}
      />

      {/* the metal */}
      <div
        className="absolute inset-0"
        style={{
          ...mask,
          background: `
            radial-gradient(circle at ${light.x}% ${light.y}%, #ffffff 0%, rgba(255,255,255,0) 38%),
            linear-gradient(${angle}deg,
              #4a4a4a 0%,
              #9d9d9d 14%,
              #f2f2f2 27%,
              #8e8e8e 38%,
              #5a5a5a 50%,
              #cfcfcf 63%,
              #ffffff 71%,
              #7e7e7e 82%,
              #3a3a3a 100%)
          `,
          transition: "background 450ms var(--ease-out-quint)",
        }}
      />

      {/* a darker inner edge, so the glyph has thickness */}
      <div
        className="absolute inset-0 opacity-55"
        style={{
          ...mask,
          background: `radial-gradient(circle at ${100 - light.x}% ${100 - light.y}%, rgba(0,0,0,0.65) 0%, transparent 52%)`,
          transition: "background 450ms var(--ease-out-quint)",
        }}
      />
    </div>
  );
}
