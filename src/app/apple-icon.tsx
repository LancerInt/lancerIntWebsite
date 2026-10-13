import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ============================================================
   APPLE TOUCH ICON
   ------------------------------------------------------------
   Same mark as icon.tsx at the 180px iOS home-screen size.

   Two differences from the favicon, both because of how iOS
   treats this image. It applies its own rounding and shadow, so
   the tile here is square and full-bleed — a rounded tile would
   be rounded twice and come out with pale corners. And the mark
   sits at a smaller share of the frame, because iOS crops
   slightly and a glyph sized for a 64px tile would touch the
   mask edge.
   ============================================================ */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = readFileSync(
  join(process.cwd(), "public", "lancer-hero-logo-light.png"),
);
const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

export default function AppleIcon() {
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
        }}
      >
        <img src={markSrc} width={112} height={112} alt="" />
      </div>
    ),
    size,
  );
}
