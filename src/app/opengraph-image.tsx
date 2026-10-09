import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

/* ============================================================
   OPENGRAPH IMAGE
   ------------------------------------------------------------
   The headline, the strapline and one accent rule on the dark
   ground. No webfont is loaded, so it renders at build time
   without a network call.
   ============================================================ */

export const alt =
  "Lancer International — we build software around the way your business works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070f0d",
          color: "#f7f5f0",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 19,
            letterSpacing: 4,
            color: "#7ad6ac",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 34, height: 2, backgroundColor: "#7ad6ac", display: "block" }} />
          {siteConfig.positioning}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: -2,
          }}
        >
          <span>We build software around</span>
          <span>the way your business works.</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(247,245,240,0.16)",
            paddingTop: 26,
            fontSize: 22,
            color: "#9caba4",
          }}
        >
          <span>{siteConfig.name}</span>
          <span>{siteConfig.statement}</span>
        </div>
      </div>
    ),
    size,
  );
}
