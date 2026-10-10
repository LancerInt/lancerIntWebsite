"use client";

import { MetalObject } from "./metal";

/* ============================================================
   CURSOR MARK
   ------------------------------------------------------------
   The LI monogram as brushed metal, lit by the cursor.

   The supplied PNG has a clean alpha channel, so it works
   directly as a CSS mask — no tracing, no SVG export. Every
   other decision lives in <MetalObject>, which the section
   icons share.
   ============================================================ */

export function CursorMark({
  size = 360,
  className,
  src = "/lancer-hero-logo-light.png",
}: {
  size?: number;
  className?: string;
  /** Any image with a clean alpha channel. Colour is ignored. */
  src?: string;
}) {
  return (
    <MetalObject
      mask={`url(${src})`}
      size={size}
      className={className}
    />
  );
}
