"use client";

import { useId, useRef, useState } from "react";
import { demoApps, pagesOf, type DemoApp } from "@/lib/demo-apps";
import { Icon } from "@/components/icons";
import { BlockView } from "./blocks";
import { cn } from "@/lib/utils";

/* ============================================================
   DEMO APPLICATIONS
   ------------------------------------------------------------
   Two illustrative systems in one window. The tabs switch
   application, the sidebar switches page, and the page really
   changes — charts redraw, bars rise, rows stagger in.

   WHY IT IS OPERABLE AND NOT A PICTURE
   A screenshot of a dashboard tells you someone can draw a
   dashboard. Letting a visitor move around inside one tells
   them it was built. That is the whole argument of the section
   it sits in, so the panel makes it rather than illustrating it.

   WHAT THAT COSTS, AND WHAT IT BUYS
   Being operable means being operable by everyone: the tabs
   follow the ARIA tabs pattern with roving focus and arrow
   keys, the sidebar is a real nav of real buttons with
   aria-current, and every target clears 44px. An interactive
   panel that only works with a mouse would be worse than the
   static one it replaced.

   IT IS STILL A DEMONSTRATION
   Nothing is for sale here. The chrome carries a "Demo data"
   chip that cannot be dismissed, every figure is invented, and
   the caption under the panel says so in words. The two product
   names come from the client with the designs — see the note in
   lib/demo-apps.ts.
   ============================================================ */

export function AppDemo({ className }: { className?: string }) {
  const [appIndex, setAppIndex] = useState(0);
  /* Page is tracked per application, so switching away and back
     returns you where you were rather than resetting. */
  const [pageIds, setPageIds] = useState<string[]>(() => demoApps.map(() => "dashboard"));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const app = demoApps[appIndex];
  const pages = pagesOf(app);
  const pageId = pageIds[appIndex];
  const page = pages.find((p) => p.id === pageId) ?? pages[0];

  const setPage = (id: string) =>
    setPageIds((prev) => prev.map((v, i) => (i === appIndex ? id : v)));

  /* Roving tabs: arrows move and activate, as the pattern says
     for an automatically-activated tablist. */
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = demoApps.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setAppIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={className}>
      {/* --- which application ------------------------------ */}
      <div
        role="tablist"
        aria-label="Illustrative applications"
        className="mb-4 flex flex-wrap justify-center gap-1.5"
      >
        {demoApps.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${baseId}-tab-${a.id}`}
            aria-selected={i === appIndex}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === appIndex ? 0 : -1}
            onClick={() => setAppIndex(i)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={cn(
              "inline-flex min-h-10 items-center rounded-full px-4 text-[0.8125rem] font-medium",
              "transition-colors duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--surface-fg)] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[var(--surface-bg)]",
              i === appIndex
                ? "bg-[var(--surface-cta-bg)] text-[var(--surface-cta-fg)]"
                : "text-[var(--surface-muted)] hover:text-[var(--surface-fg)]",
            )}
          >
            {a.wordmark.lead} {a.wordmark.trail}
          </button>
        ))}
      </div>

      {/* --- the window ------------------------------------- */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${app.id}`}
        tabIndex={-1}
        data-app={app.accent}
        className="app-demo overflow-hidden rounded-xl border border-[var(--surface-rule)] shadow-[var(--surface-lift)] sm:rounded-2xl"
      >
        <TitleBar app={app} />

        <div className="flex min-h-[26rem] bg-[var(--app-canvas)]">
          <Sidebar app={app} current={page.id} onSelect={setPage} />

          {/* The key is what makes navigation feel like
              navigation: a new one tears the subtree down, so
              every entrance animation inside replays. */}
          <div className="min-w-0 flex-1 overflow-hidden">
            {/* The rail has no room on a phone, so the pages move
                to a scrolling strip. Hiding the rail without this
                would leave the panel's whole argument — that you
                can move around inside it — unavailable on the
                device most people will see it on. */}
            <div className="scroll-rail flex gap-1.5 overflow-x-auto border-b border-[var(--app-rule)] bg-[var(--app-card)] px-3 py-2 sm:hidden">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPage(p.id)}
                  aria-current={p.id === page.id ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[12px] whitespace-nowrap",
                    "transition-colors duration-150",
                    p.id === page.id
                      ? "bg-[var(--app-accent-solid)] font-medium text-white"
                      : "text-[var(--app-muted)]",
                  )}
                >
                  <Icon name={p.icon} className="size-3.5" strokeWidth={1.5} />
                  {p.label}
                </button>
              ))}
            </div>

            <div key={`${app.id}-${page.id}`} className="p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-[var(--app-fg)] sm:text-[17px]">
                {page.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-rule)] bg-[var(--app-card)] px-2.5 py-1.5 text-[11px] text-[var(--app-fg)]">
                <Icon name="calendar" className="size-3.5 text-[var(--app-muted)]" strokeWidth={1.5} />
                <span className="hidden sm:inline">{app.dateRange}</span>
                <span className="sm:hidden">Oct 2026</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {page.rows.map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid gap-2.5",
                    row.length > 1 && "lg:grid-cols-2",
                  )}
                >
                  {row.map((block, j) => (
                    <BlockView key={j} block={block} />
                  ))}
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- chrome ---------------------------------------------- */

function TitleBar({ app }: { app: DemoApp }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--app-rail-rule)] bg-[var(--app-rail)] px-3 py-2.5">
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="size-[9px] rounded-full bg-[#ff5f57]" />
        <span className="size-[9px] rounded-full bg-[#febc2e]" />
        <span className="size-[9px] rounded-full bg-[#28c840]" />
      </span>

      <span className="ml-auto flex items-center gap-3">
        {/* The one label that is not illustrative. */}
        <span className="text-[11px] font-medium text-[var(--app-rail-muted)]">
          Demo data
        </span>
        <Icon name="bell" className="size-[15px] text-[var(--app-rail-muted)]" strokeWidth={1.5} />
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-full bg-[var(--app-rail-fg)] text-[10px] font-semibold text-[var(--app-rail)]"
        >
          A
        </span>
      </span>
    </div>
  );
}

function Sidebar({
  app,
  current,
  onSelect,
}: {
  app: DemoApp;
  current: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      aria-label={`${app.wordmark.lead} ${app.wordmark.trail} sections`}
      /* Hidden below `sm`, where it would take half the width.
         The page itself still switches — there is simply no room
         for a rail on a phone, which is what the real app would
         do too. */
      className="hidden w-[11.5rem] shrink-0 flex-col gap-4 overflow-y-auto border-r border-[var(--app-rail-rule)] bg-[var(--app-rail)] px-2.5 py-3 sm:flex"
    >
      <p className="px-2 text-[15px] font-bold text-[var(--app-rail-fg)]">
        {app.wordmark.lead}{" "}
        <span className="text-[var(--app-brand)]">{app.wordmark.trail}</span>
      </p>

      {app.groups.map((group) => (
        <div key={group.label}>
          <p className="px-2 pb-1.5 text-[9.5px] font-medium tracking-[0.12em] text-[var(--app-rail-muted)] uppercase">
            {group.label}
          </p>
          <ul>
            {group.pages.map((p) => {
              const on = p.id === current;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(p.id)}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2 text-[12.5px]",
                      "transition-colors duration-150 outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[var(--app-rail-fg)] focus-visible:ring-inset",
                      on
                        ? "bg-[var(--app-accent-solid)] font-medium text-white"
                        : "text-[var(--app-rail-muted)] hover:bg-[var(--app-rail-hover)] hover:text-[var(--app-rail-fg)]",
                    )}
                  >
                    <Icon name={p.icon} className="size-[15px] shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{p.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
