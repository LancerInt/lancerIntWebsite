"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/* ============================================================
   CURSOR OBJECT
   ------------------------------------------------------------
   The reference punctuates its sections with small rendered 3D
   objects — a chrome mark, a sphere. This is that moment, built
   without a 3D engine.

   HOW IT IS 3D WITHOUT WEBGL
   A sphere under a single light source is, optically, a radial
   gradient whose bright point sits where the light is. Move the
   light and the highlight moves; add a rim term for the light
   wrapping the far edge, a contact shadow beneath, and the eye
   reads a solid object. The whole thing is two gradients and a
   shadow.

   The light source is the cursor. That is the entire
   interaction: the highlight tracks the pointer across the
   viewport, so the object appears lit by it.

   WHY NOT THREE.JS / SPLINE
   A WebGL runtime is 150kB+ before any geometry, for one
   decorative sphere on a marketing page. Earlier briefs ruled
   out 3D engines and heavy bundles explicitly. This is ~2kB of
   component and composites on the GPU anyway.

   The metal tones come from the --metal-* tokens, which flip
   with prefers-color-scheme: dark steel on a light ground,
   bright chrome on a dark one. A sphere lit for a near-black
   page is a white blob on an ivory one.

   Hidden from assistive tech — it carries no information.
   Static under reduced motion, where it keeps a fixed
   top-left light and simply stops following.
   ============================================================ */

export function CursorObject({
  size = 96,
  className,
}: {
  /** Rendered diameter in px. */
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* light position as a percentage across the object's face */
  const [light, setLight] = useState({ x: 32, y: 26 });
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
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        /* Offset from centre, normalised against a generous
           radius so the highlight glides rather than snapping
           to the edge the moment the pointer leaves the object. */
        const dx = (e.clientX - cx) / (window.innerWidth * 0.55);
        const dy = (e.clientY - cy) / (window.innerHeight * 0.75);

        setLight({
          x: 50 + Math.max(-1, Math.min(1, dx)) * 42,
          y: 50 + Math.max(-1, Math.min(1, dy)) * 42,
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  /* the rim brightens opposite the light, as it would on a
     real sphere where the source wraps the far edge */
  const rimX = 100 - light.x;
  const rimY = 100 - light.y;

  return (
    <div
      aria-hidden="true"
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
    >
      {/* No bloom div. A `rounded-full` element whose gradient
          fades out before its own edge draws a faint disc around
          the object — visible, and read as a rendering artefact.
          The glow lives in the box-shadow below instead, where it
          is bounded by the sphere itself. */}
      <div
        ref={ref}
        className="relative size-full rounded-full"
        style={{
          background: `
            radial-gradient(circle at ${rimX}% ${rimY}%, var(--sphere-rim) 0%, transparent 42%),
            radial-gradient(circle at ${light.x}% ${light.y}%,
              var(--metal-hi) 0%,
              var(--metal-1) 11%,
              var(--metal-2) 32%,
              var(--metal-3) 62%,
              var(--metal-4) 85%,
              var(--sphere-core) 100%)
          `,
          boxShadow: `
            0 ${size * 0.3}px ${size * 0.55}px -${size * 0.18}px var(--sphere-cast),
            0 0 ${size * 0.5}px var(--metal-glow),
            inset 0 0 ${size * 0.12}px var(--metal-shade)
          `,
          transition: "background 420ms var(--ease-out-quint)",
        }}
      />
    </div>
  );
}
