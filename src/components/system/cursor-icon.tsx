"use client";

import { MetalObject } from "./metal";

/* ============================================================
   CURSOR ICON
   ------------------------------------------------------------
   A small metal object at the head of each section, lit by the
   cursor. Same renderer as the hero monogram — only the mask
   differs.

   WHY SHAPES AND NOT A STOCK ICON SET
   These are masks, not drawings: the metal shows through the
   alpha, so the form has to be chunky enough to hold a gradient
   and a rim. A 1.5px-stroke line icon has nowhere for a
   highlight to travel and reads as a grey outline.

   WHY THESE SHAPES
   Each one says something about the section it heads, so the
   row of them down the page is a second reading of the
   argument rather than decoration:

     scatter   information in pieces, which is the problem
     grid      a set of systems, which is the work
     steps     a sequence, which is the process
     interlock two parts meeting, which is the collaboration
     stack     something being built up, not yet named
     orbit     a team around one idea
     bubble    a conversation, which is the ask

   If a section's argument changes, change its shape. An icon
   that no longer matches its section is worse than none.
   ============================================================ */

/* 24x24 viewBox. Solid fills and thick strokes only. */
const SHAPES = {
  /** Pieces that do not line up. */
  scatter: `
    <rect x="2.5" y="3" width="7.5" height="7.5" rx="2.2"/>
    <rect x="14.5" y="2.5" width="6.5" height="6.5" rx="2"/>
    <rect x="4" y="14" width="9" height="8" rx="2.6"/>
    <rect x="17" y="14.5" width="5" height="5" rx="1.6"/>`,

  /** Four modules, evenly set. */
  grid: `
    <rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.6"/>
    <rect x="13" y="2.5" width="8.5" height="8.5" rx="2.6"/>
    <rect x="2.5" y="13" width="8.5" height="8.5" rx="2.6"/>
    <rect x="13" y="13" width="8.5" height="8.5" rx="2.6"/>`,

  /** A rising sequence. */
  steps: `
    <rect x="2.5" y="14" width="4.5" height="7.5" rx="1.6"/>
    <rect x="9.75" y="9" width="4.5" height="12.5" rx="1.6"/>
    <rect x="17" y="3.5" width="4.5" height="18" rx="1.6"/>`,

  /** Two brackets facing across a gap. */
  interlock: `
    <path d="M2.5 2.5 H11 V7 H7 V11 H2.5 Z"/>
    <path d="M21.5 21.5 H13 V17 H17 V13 H21.5 Z"/>`,

  /** Plates building up. */
  stack: `
    <rect x="5" y="3.4" width="14" height="4.3" rx="2.15"/>
    <rect x="2.5" y="9.85" width="19" height="4.3" rx="2.15"/>
    <rect x="6.5" y="16.3" width="11" height="4.3" rx="2.15"/>`,

  /** A core with something around it. */
  orbit: `
    <circle cx="12" cy="12" r="4.3"/>
    <circle cx="12" cy="12" r="9.3" fill="none" stroke="#fff" stroke-width="2.7"/>`,

  /** Someone saying something. */
  bubble: `
    <rect x="2.5" y="3.5" width="19" height="14" rx="4.2"/>
    <path d="M7.5 15.5 h6.2 l-6.4 6a.62.62 0 0 1-1.04-.45 V15.5 Z"/>`,
} as const;

export type IconShape = keyof typeof SHAPES;

function maskFor(shape: IconShape) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">` +
    SHAPES[shape].replace(/\s+/g, " ").trim() +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function CursorIcon({
  shape,
  size = 46,
  className,
}: {
  shape: IconShape;
  size?: number;
  className?: string;
}) {
  return (
    <MetalObject
      mask={maskFor(shape)}
      size={size}
      /* Small objects need a wider swing than the monogram or
         the tilt is imperceptible at this scale. */
      tilt={13}
      cap={22}
      className={className}
    />
  );
}
