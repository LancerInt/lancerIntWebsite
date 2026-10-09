"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { observeReveal } from "./reveal";

/* ============================================================
   AnimatedText
   ------------------------------------------------------------
   Line-by-line mask reveal for display type. Lines are authored
   explicitly as an array rather than measured at runtime, so
   the break points are an art-direction decision and the text
   never reflows mid-animation.

   Without JS or with reduced motion the lines render plainly.
   ============================================================ */

export function AnimatedText({
  lines,
  className,
  lineClassName,
  as: Tag = "h1",
  stagger = 90,
  start = 120,
  /** Renders a word in editorial serif italic wherever it appears. */
  accentWord,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "p" | "div";
  stagger?: number;
  start?: number;
  accentWord?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    /* Shares the Reveal manager, so headlines get the same
       jumped-past sweep and failsafe. Three headline lines in
       the enterprise section were stuck invisible before. */
    return observeReveal(node, () => setShown(true));
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span
          key={line + i}
          className={cn("block overflow-hidden", lineClassName)}
        >
          <span
            data-reveal-line=""
            className="block"
            style={{
              transform: shown ? "translateY(0)" : "translateY(105%)",
              opacity: shown ? 1 : 0,
              transition: `transform 900ms var(--ease-out-quint) ${start + i * stagger}ms, opacity 500ms linear ${start + i * stagger}ms`,
            }}
          >
            {renderAccent(line, accentWord)}
          </span>
        </span>
      ))}
    </Tag>
  );
}

function renderAccent(line: string, accentWord?: string) {
  if (!accentWord) return line;
  const index = line.indexOf(accentWord);
  if (index === -1) return line;
  return (
    <>
      {line.slice(0, index)}
      <span className="accent-italic">{accentWord}</span>
      {line.slice(index + accentWord.length)}
    </>
  );
}
