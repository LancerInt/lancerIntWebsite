import type { Block, Cell, Pill } from "@/lib/demo-apps";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ============================================================
   DEMO APP — BLOCKS
   ------------------------------------------------------------
   One renderer per block kind. The data file knows the content,
   these know the drawing, and neither knows the other.

   Charts are hand-drawn SVG. A chart library here would be
   40-60kB of runtime to render twelve points that never change,
   on a panel that exists to illustrate rather than to report.

   Everything animates in on mount. Each page gets a fresh React
   key when it changes, so the whole set replays on navigation
   rather than only on first paint.
   ============================================================ */

const CARD =
  "rounded-xl border border-[var(--app-rule)] bg-[var(--app-card)] shadow-[var(--app-shadow)]";

const PILL_TONE: Record<Pill["tone"], string> = {
  ok: "bg-[var(--pill-ok-bg)] text-[var(--pill-ok-fg)]",
  warn: "bg-[var(--pill-warn-bg)] text-[var(--pill-warn-fg)]",
  info: "bg-[var(--pill-info-bg)] text-[var(--pill-info-fg)]",
  neutral: "bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)]",
};

function StatusPill({ pill }: { pill: Pill }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-[3px] text-[11px] leading-none font-medium whitespace-nowrap",
        PILL_TONE[pill.tone],
      )}
    >
      {pill.label}
    </span>
  );
}

/** A heading with an optional "View all" that goes nowhere. */
function BlockHead({ title, link }: { title?: string; link?: boolean }) {
  if (!title) return null;
  return (
    <div className="flex items-center justify-between gap-4 px-4 pt-3.5 pb-3">
      <h4 className="text-[13px] font-semibold text-[var(--app-fg)]">{title}</h4>
      {link ? (
        /* Not a link. Nothing in this panel navigates anywhere
           real, and a dead <a> is worse than a label. */
        <span className="text-[11px] font-medium text-[var(--app-link)]">
          View all
        </span>
      ) : null}
    </div>
  );
}

/* ---- stats ----------------------------------------------- */

function Stats({ items }: Extract<Block, { kind: "stats" }>) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={s.label}
          className={cn(CARD, "flex items-center gap-3 p-3")}
          style={{ animation: `app-page-in 420ms var(--ease-out-quint) ${i * 60}ms both` }}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)]">
            <Icon name={s.icon} className="size-[18px]" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-[var(--app-fg)]">
              {s.label}
            </p>
            <p className="mt-0.5 flex items-baseline gap-1.5">
              <span
                data-numeric
                className="text-[19px] leading-none font-semibold text-[var(--app-fg)]"
              >
                {s.value}
              </span>
              {s.delta ? (
                <span
                  data-numeric
                  className="text-[11px] font-medium whitespace-nowrap"
                  style={{
                    color: s.dir === "down" ? "var(--num-neg)" : "var(--num-pos)",
                  }}
                >
                  {s.dir === "down" ? "↓" : "↑"} {s.delta}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-[var(--app-muted)]">
              {s.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- line ------------------------------------------------ */

function LineChart({ title, control, labels, values }: Extract<Block, { kind: "line" }>) {
  const W = 520;
  const H = 190;
  const PAD = { l: 34, r: 10, t: 10, b: 22 };
  const max = Math.ceil(Math.max(...values) / 50) * 50 || 50;
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;

  const x = (i: number) => PAD.l + (i / (values.length - 1)) * iw;
  const y = (v: number) => PAD.t + ih - (v / max) * ih;

  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L${x(values.length - 1)} ${PAD.t + ih} L${x(0)} ${PAD.t + ih} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <div className="flex items-center justify-between gap-4 px-4 pt-3.5 pb-2">
        <h4 className="text-[13px] font-semibold text-[var(--app-fg)]">{title}</h4>
        {control ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--app-rule)] px-2 py-1 text-[11px] text-[var(--app-fg)]">
            {control}
            <svg viewBox="0 0 16 16" className="size-3 text-[var(--app-muted)]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 6.5 8 10.5 12 6.5" />
            </svg>
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 px-2 pb-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="presentation">
          {/* grid + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--app-rule)"
                strokeWidth="1"
              />
              <text
                x={PAD.l - 6}
                y={y(t) + 3.5}
                textAnchor="end"
                className="fill-[var(--app-muted)] text-[9px]"
              >
                {t}
              </text>
            </g>
          ))}

          <defs>
            <linearGradient id={`fill-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--app-accent)" stopOpacity="0.26" />
              <stop offset="100%" stopColor="var(--app-accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <path
            d={area}
            fill={`url(#fill-${title.replace(/\s/g, "")})`}
            style={{ animation: "app-area-in 700ms var(--ease-out-quint) 260ms both" }}
          />

          {/* The stroke draws itself: dasharray is the path's own
              length, and the offset animates to zero. */}
          <path
            d={line}
            fill="none"
            stroke="var(--app-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1000}
            style={{
              ["--len" as string]: "1000",
              strokeDasharray: 1000,
              animation: "app-line-draw 900ms var(--ease-out-quint) both",
            }}
          />

          {values.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r="3"
              fill="var(--app-card)"
              stroke="var(--app-accent)"
              strokeWidth="2"
              style={{
                transformOrigin: `${x(i)}px ${y(v)}px`,
                animation: `app-dot-in 300ms var(--ease-out-quint) ${300 + i * 45}ms both`,
              }}
            />
          ))}

          {/* The end labels anchor to their own edge rather than
              centring, or half of the last one hangs past the
              plot and gets cut by the card. */}
          {labels.map((l, i) => (
            <text
              key={l}
              x={x(i)}
              y={H - 6}
              textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
              className="fill-[var(--app-muted)] text-[9px]"
            >
              {l}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ---- bars ------------------------------------------------ */

function BarChart({ title, link, labels, values }: Extract<Block, { kind: "bars" }>) {
  const max = Math.max(...values);
  const step = Math.ceil(max / 5 / 50) * 50 || Math.ceil(max / 5);
  const top = step * 5 >= max ? step * 5 : Math.ceil(max / step) * step;
  const ticks = Array.from({ length: 6 }, (_, i) => top - i * (top / 5));

  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <BlockHead title={title} link={link} />
      <div className="flex min-h-[180px] flex-1 gap-2 px-4 pb-4">
        <div className="flex shrink-0 flex-col justify-between pb-5 text-right text-[9px] text-[var(--app-muted)]">
          {ticks.map((t) => (
            <span key={t} data-numeric>
              {t.toLocaleString()}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* grid */}
          <div className="absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between">
            {ticks.map((t) => (
              <span key={t} className="h-px w-full bg-[var(--app-rule)]" />
            ))}
          </div>

          <div className="relative flex h-[calc(100%-1.25rem)] items-end gap-[3px]">
            {values.map((v, i) => (
              <div
                key={i}
                className="min-w-0 flex-1 rounded-t-[3px] bg-[var(--app-accent)]"
                style={{
                  height: `${(v / top) * 100}%`,
                  transformOrigin: "bottom",
                  animation: `app-bar-rise 560ms var(--ease-out-quint) ${i * 45}ms both`,
                }}
              />
            ))}
          </div>

          <div className="flex gap-[3px] pt-1">
            {labels.map((l) => (
              <span
                key={l}
                className="min-w-0 flex-1 truncate text-center text-[9px] text-[var(--app-muted)]"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- feed ------------------------------------------------ */

function Feed({ title, link, rows }: Extract<Block, { kind: "feed" }>) {
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <BlockHead title={title} link={link} />
      <ul className="flex-1">
        {rows.map((r, i) => (
          <li
            key={`${r.title}-${i}`}
            className="flex items-center gap-3 border-t border-[var(--app-rule)] px-4 py-2.5"
            style={{ animation: `app-page-in 380ms var(--ease-out-quint) ${i * 50}ms both` }}
          >
            <span
              aria-hidden="true"
              className="size-[7px] shrink-0 rounded-full bg-[var(--app-accent)]"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[var(--app-fg)]">
                {r.title}
              </p>
              <p className="truncate text-[11px] text-[var(--app-muted)]">{r.sub}</p>
            </div>
            <span className="hidden shrink-0 text-[11px] text-[var(--app-muted)] sm:block">
              {r.meta}
            </span>
            <StatusPill pill={r.pill} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- table ----------------------------------------------- */

function DataCell({ cell, i }: { cell: Cell; i: number }) {
  if (typeof cell === "string") return <>{cell}</>;

  if ("pill" in cell) return <StatusPill pill={cell.pill} />;

  if ("num" in cell)
    return (
      <span
        data-numeric
        style={
          cell.tone
            ? { color: cell.tone === "pos" ? "var(--num-pos)" : "var(--num-neg)" }
            : undefined
        }
      >
        {cell.num}
      </span>
    );

  return (
    <span className="flex items-center gap-2">
      <span data-numeric className="w-9 shrink-0 text-[11px] text-[var(--app-muted)]">
        {cell.progress}%
      </span>
      <span className="h-1.5 min-w-[48px] flex-1 overflow-hidden rounded-full bg-[var(--app-track)]">
        <span
          className="block h-full rounded-full bg-[var(--app-accent)]"
          style={{
            width: `${cell.progress}%`,
            transformOrigin: "left",
            animation: `app-fill 620ms var(--ease-out-quint) ${160 + i * 70}ms both`,
          }}
        />
      </span>
    </span>
  );
}

function DataTable({ title, link, columns, align, rows }: Extract<Block, { kind: "table" }>) {
  const at = (i: number) => (align?.[i] === "r" ? "text-right" : "text-left");

  return (
    <div className={cn(CARD, "flex h-full flex-col overflow-hidden")}>
      <BlockHead title={title} link={link} />
      {/* Wide tables scroll inside the card rather than widening
          the page — the layout audit treats a clipped ancestor
          as intentional, which this is. */}
      <div className="min-w-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse">
          <thead>
            <tr className="border-y border-[var(--app-rule)] bg-[var(--app-canvas)]">
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    "px-4 py-2 text-[11px] font-medium whitespace-nowrap text-[var(--app-muted)]",
                    at(i),
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr
                key={ri}
                className="border-b border-[var(--app-rule)] last:border-0"
                style={{ animation: `app-page-in 380ms var(--ease-out-quint) ${ri * 45}ms both` }}
              >
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "px-4 py-2.5 text-[12px] whitespace-nowrap text-[var(--app-fg)]",
                      at(ci),
                    )}
                  >
                    <DataCell cell={cell} i={ri} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---- the switch ------------------------------------------ */

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "stats":
      return <Stats {...block} />;
    case "line":
      return <LineChart {...block} />;
    case "bars":
      return <BarChart {...block} />;
    case "feed":
      return <Feed {...block} />;
    case "table":
      return <DataTable {...block} />;
  }
}
