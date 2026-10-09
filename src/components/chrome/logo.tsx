import Image from "next/image";
import { cn } from "@/lib/utils";

/* ============================================================
   LOGO
   ------------------------------------------------------------
   The supplied brand lockup, in its two shipped variants:

     tone="light"  → white artwork, for dark grounds
     tone="dark"   → full colour (navy + gold), for light grounds

   Both files carry a real alpha channel, so neither shows a
   box on its background.

   The two exports have different intrinsic ratios — 2.34 for
   the colour version, 2.81 for the white one, because the white
   export is cropped tighter vertically. Sizing by WIDTH rather
   than height is what keeps them optically equal: the
   horizontal extent of the wordmark is what the eye measures.

   Intrinsic width/height are passed so the browser reserves the
   right box and the logo never shifts the masthead on load.
   ============================================================ */

const VARIANTS = {
  dark: { src: "/lancer-logo.png", width: 514, height: 220 },
  light: { src: "/lancer-logo-light.png", width: 509, height: 181 },
} as const;

export function Logo({
  tone = "dark",
  className,
  width = "w-[112px]",
  priority = false,
}: {
  tone?: "light" | "dark";
  className?: string;
  /** Tailwind width class — size by width, never by height. */
  width?: string;
  priority?: boolean;
}) {
  const variant = VARIANTS[tone];

  return (
    <Image
      src={variant.src}
      alt="Lancer International"
      width={variant.width}
      height={variant.height}
      priority={priority}
      className={cn("h-auto", width, className)}
    />
  );
}
