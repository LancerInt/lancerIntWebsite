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
   a CSS mask over a metallic gradient stack. Only the glyph
   shows through. Mask plus moving gradient = chrome, with no
   WebGL and no 3D asset pipeline.

   WHAT MOVES
   Three things, together, so the object itself feels handled
   rather than just lit:
     · the specular band sweeps across the metal
     · the glyph tilts on both axes in real perspective
     · the shadow shifts opposite the light

   NO DISC
   The previous version put the glow on a `rounded-full` div.
   Its gradient faded out before the element's edge, which drew
   a visible circle around the mark. The glow is now a
   drop-shadow on the masked layer, so it follows the glyph's
   own silhouette and has no boundary of its own.

   Decorative: aria-hidden, static under reduced motion.
   ============================================================ */

/** Degrees of tilt at the far edge of the viewport. */
const TILT = 9;

export function CursorMark({
  size = 320,
  className,
  src = "/lancer-hero-logo-light.png",
}: {
  size?: number;
  className?: string;
  src?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });
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
        setP({
          x: Math.max(-1, Math.min(1, dx)),
          y: Math.max(-1, Math.min(1, dy)),
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  /* light position across the glyph face, 0–100 */
  const lx = 50 + p.x * 46;
  const ly = 50 + p.y * 46;
  /* the band runs perpendicular to the light */
  const angle = 90 + p.x * 70;

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

  const ease = "transform 500ms var(--ease-out-quint), background 450ms var(--ease-out-quint), filter 450ms var(--ease-out-quint)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative select-none", className)}
      /* The component owns its own width. Passing `size` inline
         and a `w-[…]` class from the caller does not work — an
         inline style beats every class, so the responsive class
         was dead and this rendered at full size on a phone.
         One declaration, capped against the viewport instead. */
      style={{
        width: `min(62vw, ${size}px)`,
        aspectRatio: "1",
        perspective: "900px",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `rotateY(${p.x * TILT}deg) rotateX(${-p.y * TILT}deg)`,
          transformStyle: "preserve-3d",
          transition: ease,
        }}
      >
        {/* the metal. The glow is a drop-shadow here, so it
            takes the glyph's shape instead of a circle. */}
        <div
          className="absolute inset-0"
          style={{
            ...mask,
            background: `
              radial-gradient(circle at ${lx}% ${ly}%, var(--metal-spec) 0%, transparent 42%),
              linear-gradient(${angle}deg,
                var(--metal-4) 0%,
                var(--metal-2) 14%,
                var(--metal-hi) 27%,
                var(--metal-2) 38%,
                var(--metal-3) 50%,
                var(--metal-1) 63%,
                var(--metal-hi) 71%,
                var(--metal-2) 82%,
                var(--metal-4) 100%)
            `,
            filter: `drop-shadow(${-p.x * 16}px ${-p.y * 10 + 14}px 26px var(--metal-glow))`,
            transition: ease,
          }}
        />

        {/* contact shade opposite the light, so the glyph
            reads as solid rather than printed */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            ...mask,
            background: `radial-gradient(circle at ${100 - lx}% ${100 - ly}%, var(--metal-shade) 0%, transparent 54%)`,
            transition: ease,
          }}
        />
      </div>
    </div>
  );
}
