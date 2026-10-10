"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/* ============================================================
   METAL
   ------------------------------------------------------------
   One brushed-metal object lit by the cursor. The hero monogram
   and every section icon are the same component with a
   different mask.

   HOW IT IS METAL WITHOUT WEBGL
   Four masked layers over the same silhouette:

     1. the band — a linear gradient whose stops run dark, bright,
        dark, so a specular streak crosses the form
     2. the brush — fine repeating lines across the band. This is
        the layer that reads as *metal* rather than as a grey
        gradient; without it the surface looks like plastic
     3. the specular — a soft radial wash where the cursor is
     4. the contact shade — the opposite corner falling off, so
        the form reads as solid rather than printed

   WHY THE FILTER IS ON A WRAPPER
   The rim and glow are drop-shadows, and a filter on a masked
   element is applied to the element's *box* before the mask
   clips it — the shadow of a rectangle, then thrown away. So
   the masked layers sit inside a wrapper and the filter goes on
   the wrapper, where it sees the already-masked result and
   traces the real silhouette.

   THE RIM IS THE POINT
   A metal object against a flat ground needs an edge or it
   dissolves into the background. Two stacked hard drop-shadows
   in --metal-rim give a crisp outline that follows the glyph:
   near-white on a dark ground, near-black on a light one, since
   a white rim on an ivory page is no rim at all.

   NO DISC. Nothing here may use a `rounded-full` glow element —
   a circle whose gradient fades out before its own edge draws a
   visible disc around the object. Glow lives in the filter.

   Decorative throughout: aria-hidden, mouse only, and static
   under reduced motion.
   ============================================================ */

/** Pointer position relative to the object, each axis -1..1. */
export function useCursorLight(ref: React.RefObject<HTMLElement | null>) {
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
        /* Normalised against a generous radius, so the light
           glides toward the object instead of snapping the
           moment the pointer crosses its edge. */
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
  }, [ref, reduce]);

  return p;
}

export function MetalObject({
  /** Any CSS mask-image value — a PNG url() or an SVG data URI. */
  mask,
  /** Rendered size in px. Capped against the viewport. */
  size,
  /** Share of the viewport this may occupy on a narrow screen. */
  cap = 62,
  /** Degrees of tilt at the far edge of the viewport. */
  tilt = 9,
  className,
}: {
  mask: string;
  size: number;
  cap?: number;
  tilt?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useCursorLight(ref);

  /* where the light lands on the face, 0–100 */
  const lx = 50 + p.x * 46;
  const ly = 50 + p.y * 46;
  /* the band turns with the light; the brush runs across it */
  const angle = 90 + p.x * 70;

  /* The rim has to scale with the object or a 48px icon gets the
     same 2px outline as a 360px monogram and reads as a sticker. */
  const rim = Math.max(0.6, size / 230);

  const layer = {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    position: "absolute",
    inset: 0,
  } as const;

  const ease =
    "transform 500ms var(--ease-out-quint), background 450ms var(--ease-out-quint), filter 450ms var(--ease-out-quint)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative select-none", className)}
      /* The object owns its width. Taking `size` inline *and* a
         w-[…] class from the caller does not work — inline style
         beats every class, so the responsive class is dead and
         it renders full size on a phone. */
      style={{
        width: `min(${cap}vw, ${size}px)`,
        aspectRatio: "1",
        perspective: `${size * 2.6}px`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `rotateY(${p.x * tilt}deg) rotateX(${-p.y * tilt}deg)`,
          transformStyle: "preserve-3d",
          transition: ease,
        }}
      >
        {/* The filter wrapper. Its children are masked, so the
            rim and glow trace the silhouette rather than a box. */}
        <div
          className="absolute inset-0"
          style={{
            filter: `
              drop-shadow(0 0 ${rim}px var(--metal-rim))
              drop-shadow(0 0 ${rim}px var(--metal-rim))
              drop-shadow(${-p.x * 14}px ${-p.y * 9 + 12}px ${size * 0.16}px var(--metal-glow))
            `,
            transition: ease,
          }}
        >
          {/* 1 · the band */}
          <div
            style={{
              ...layer,
              background: `linear-gradient(${angle}deg,
                var(--metal-4) 0%,
                var(--metal-2) 13%,
                var(--metal-hi) 26%,
                var(--metal-1) 34%,
                var(--metal-3) 47%,
                var(--metal-2) 56%,
                var(--metal-1) 64%,
                var(--metal-hi) 72%,
                var(--metal-2) 84%,
                var(--metal-4) 100%)`,
              transition: ease,
            }}
          />

          {/* 2 · the brush. Fine lines across the band — this is
              what separates metal from a grey gradient. */}
          <div
            style={{
              ...layer,
              background: `repeating-linear-gradient(${angle + 90}deg,
                var(--metal-brush) 0px,
                var(--metal-brush) 1px,
                transparent 1px,
                transparent 3px)`,
              transition: ease,
            }}
          />

          {/* 3 · the specular wash */}
          <div
            style={{
              ...layer,
              background: `radial-gradient(circle at ${lx}% ${ly}%, var(--metal-spec) 0%, transparent 44%)`,
              transition: ease,
            }}
          />

          {/* 4 · contact shade, opposite the light */}
          <div
            style={{
              ...layer,
              opacity: 0.5,
              background: `radial-gradient(circle at ${100 - lx}% ${100 - ly}%, var(--metal-shade) 0%, transparent 56%)`,
              transition: ease,
            }}
          />
        </div>
      </div>
    </div>
  );
}
