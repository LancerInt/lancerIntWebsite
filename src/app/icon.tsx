import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ============================================================
   FAVICON
   ------------------------------------------------------------
   The LI monogram, composed at build time.

   WHY IT IS COMPOSED AND NOT JUST COPIED
   The shipped artwork is a white glyph on transparency. Dropped
   in as `icon.png` it would vanish against a light browser tab
   strip, which is where most people will see it. So it gets a
   near-black rounded ground: the white mark reads on a light
   strip because of the dark tile, and on a dark strip because
   the mark itself is light.

   This is also why it does not follow the system scheme the way
   the rest of the site does. Browsers only re-evaluate a
   favicon per scheme for SVG sources, and the mark is a raster
   with no vector original — so one tile that works in both
   beats a scheme-aware one that works in neither.

   The ground is --s-deep from the dark scheme, written out,
   because @theme is not reachable from an image route.
   ============================================================ */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/* Read at module scope: this route is statically generated, so
   the file is inlined once at build and never at request time. */
const mark = readFileSync(
  join(process.cwd(), "public", "lancer-hero-logo-light.png"),
);
const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0b",
          borderRadius: 14,
        }}
      >
        {/* 76% of the tile — the artwork carries almost no
            padding of its own, and a glyph running to the edge
            of a 16px favicon reads as a smudge. */}
        <img src={markSrc} width={49} height={49} alt="" />
      </div>
    ),
    size,
  );
}
