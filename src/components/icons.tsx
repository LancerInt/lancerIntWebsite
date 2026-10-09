import type { IconKey } from "@/lib/demo-interface";

/* ============================================================
   ICON SET
   ------------------------------------------------------------
   One family, one language: 1.25 stroke, square caps, 24-unit
   grid, no fills. Drawn here rather than pulled from a library
   so the stroke weight stays consistent with the hairlines used
   everywhere else in the design system.
   ============================================================ */

const paths: Record<IconKey, React.ReactNode> = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </>
  ),
  flow: (
    <>
      <circle cx="5.5" cy="6" r="2" />
      <circle cx="18.5" cy="12" r="2" />
      <circle cx="5.5" cy="18" r="2" />
      <path d="M7.5 6h5a4 4 0 0 1 4 4v0" />
      <path d="M7.5 18h5a4 4 0 0 0 4-4v0" />
    </>
  ),
  check: (
    <>
      <path d="M4 12.5l4.5 4.5L20 5.5" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5 3.5 16.5z" />
      <path d="M3.5 7.5 12 11.5l8.5-4" />
      <path d="M12 11.5v9" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h10v9h-10z" />
      <path d="M12.5 10h4l3 3v2.5h-7z" />
      <circle cx="6.5" cy="18" r="1.75" />
      <circle cx="16.5" cy="18" r="1.75" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5V3.5" />
      <path d="M3.5 20.5h17" />
      <path d="M7.5 17V11" />
      <path d="M12 17V7" />
      <path d="M16.5 17v-4" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 13.5 6 4.5h12l2.5 9v6h-17z" />
      <path d="M3.5 13.5h4l1 2.5h7l1-2.5h4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19.5v-1a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v1" />
      <path d="M16 5.5a3 3 0 0 1 0 5" />
      <path d="M17 14.5h.5a4 4 0 0 1 4 4v1" />
    </>
  ),
  file: (
    <>
      <path d="M6 3.5h7l5 5v12H6z" />
      <path d="M13 3.5v5h5" />
      <path d="M9 13h6M9 16.5h6" />
    </>
  ),
  bell: (
    <>
      <path d="M7 10a5 5 0 0 1 10 0v4l2 3H5l2-3z" />
      <path d="M10 17a2 2 0 0 0 4 0" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7 2.5v6c0 4-3 7-7 8.5-4-1.5-7-4.5-7-8.5V6z" />
      <path d="M9 12l2.25 2.25L15.5 10" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="2.75" />
      <path d="M4.5 6v12c0 1.5 3.4 2.75 7.5 2.75s7.5-1.25 7.5-2.75V6" />
      <path d="M4.5 12c0 1.5 3.4 2.75 7.5 2.75s7.5-1.25 7.5-2.75" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3.5v5M15 3.5v5" />
      <path d="M6.5 8.5h11v3a5.5 5.5 0 0 1-11 0z" />
      <path d="M12 17v3.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.5 3.5 8 12 12.5 20.5 8z" />
      <path d="M3.5 12 12 16.5 20.5 12" />
      <path d="M3.5 16 12 20.5 20.5 16" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 7.5 3.5 12l5 4.5" />
      <path d="M15.5 7.5 20.5 12l-5 4.5" />
      <path d="M13.5 4.5l-3 15" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" />
      <path d="M18 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  phone: (
    <>
      <path d="M8 3.5H5.5A1.5 1.5 0 0 0 4 5.2C4.4 12.3 11.7 19.6 18.8 20a1.5 1.5 0 0 0 1.7-1.5V16l-4-1.5-2 2a13.6 13.6 0 0 1-5.8-5.8l2-2z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="M3.5 7 12 13l8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </>
  ),
};

export function Icon({
  name,
  className = "size-4",
  strokeWidth = 1.25,
}: {
  name: IconKey;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowDown({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 4v15" />
      <path d="M6 13l6 6 6-6" />
    </svg>
  );
}
