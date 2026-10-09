import Image from "next/image";
import { cn } from "@/lib/utils";

/* ============================================================
   LOGO
   ------------------------------------------------------------
   Follows the system colour scheme.

   Both shipped lockups are rendered and one is hidden, rather
   than swapping `src` from JS. A media query cannot be read
   during server rendering, so a JS swap would either flash the
   wrong lockup on load or need a blocking inline script. Two
   <Image>s and a `dark:` class is cheaper than either, and the
   hidden one is never fetched.

   WHY THE BOX IS RESERVED
   The two files are not the same shape — the full-colour
   lockup is 514x220 and the white one 509x181, because they
   were trimmed differently. The first attempt put the light
   variant in flow and the dark one `absolute inset-0`, which
   meant that in a dark scheme the only painted image was out
   of flow: the wrapper collapsed to zero height and the
   artwork overflowed the masthead and clipped.

   So the wrapper reserves the taller ratio and both variants
   are contained inside it. Identical geometry in both schemes,
   no collapse, and no layout shift as either one decodes.

   The differing trim is an asset problem, not a CSS one. If
   the two files are ever re-exported on a common canvas, the
   object-contain here becomes a no-op rather than a fix to
   unpick.
   ============================================================ */

const LOCKUP = {
  /** full colour (navy + gold) — for light grounds */
  colour: { src: "/lancer-logo.png", width: 514, height: 220 },
  /** white artwork — for dark grounds */
  white: { src: "/lancer-logo-light.png", width: 509, height: 181 },
} as const;

/** The taller of the two, so neither is cropped. */
const BOX = `${LOCKUP.colour.width} / ${LOCKUP.colour.height}`;

export function Logo({
  className,
  width = "w-[112px]",
  priority = false,
}: {
  className?: string;
  /** Tailwind width class — size by width, never by height. */
  width?: string;
  priority?: boolean;
}) {
  const fit = "absolute inset-0 size-full object-contain object-left";

  return (
    <span
      className={cn("relative block", width, className)}
      style={{ aspectRatio: BOX }}
    >
      <Image
        src={LOCKUP.colour.src}
        alt="Lancer International"
        width={LOCKUP.colour.width}
        height={LOCKUP.colour.height}
        priority={priority}
        className={cn(fit, "dark:hidden")}
      />
      <Image
        src={LOCKUP.white.src}
        alt=""
        aria-hidden="true"
        width={LOCKUP.white.width}
        height={LOCKUP.white.height}
        priority={priority}
        className={cn(fit, "hidden dark:block")}
      />
    </span>
  );
}
