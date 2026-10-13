"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   SELECT
   ------------------------------------------------------------
   A listbox that can actually be styled.

   WHY NOT <select>
   The option list of a native select is painted by the
   operating system, not the page. On this site that meant a
   grey Windows popup opening out of an otherwise themed form —
   it ignored the surface tokens, the radius, the type and the
   colour scheme, and there is no CSS that reaches it.

   WHAT A NATIVE SELECT GIVES YOU FOR FREE
   Keyboard operation, screen-reader semantics, typeahead and
   form participation. Replacing it means re-implementing all
   four, and a custom dropdown that skips them is a worse
   control than the ugly one it replaced. So:

   · ARIA 1.2 select-only combobox — a button with
     role="combobox" owning a role="listbox", with
     aria-activedescendant tracking the active option rather
     than moving DOM focus into the list.
   · Full keyboard: Up/Down, Alt+Up/Down, Home/End, Enter,
     Space, Escape, Tab. Closed, Up/Down change the value
     directly, the way a native select does.
   · Typeahead, including multi-character within a second.
   · A hidden input carries the value, so FormData sees this
     exactly as it saw the select.

   ONE DELIBERATE DIFFERENCE
   There is no `required` on the hidden input: a hidden control
   is barred from constraint validation, so the browser would
   silently never enforce it. The server action already
   validates this field and renders the error in the same place
   as every other one, so the check is real — it just costs a
   round trip instead of a native bubble.

   The list flips above the trigger when there is not enough
   room below, which matters because this field sits low on the
   contact page.
   ============================================================ */

const TYPEAHEAD_MS = 1000;

export function Select({
  id,
  name,
  options,
  placeholder,
  defaultValue,
  invalid,
  describedBy,
  labelledBy,
  className,
}: {
  id: string;
  name: string;
  options: readonly string[];
  placeholder: string;
  defaultValue?: string;
  invalid?: boolean;
  describedBy?: string;
  /** id of the visible <label>, so the control is named by it. */
  labelledBy: string;
  className?: string;
}) {
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [flip, setFlip] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ buffer: "", at: 0 });

  const selectedIndex = useMemo(
    () => options.indexOf(value),
    [options, value],
  );

  /* ---- opening ------------------------------------------- */
  const openList = useCallback(
    (startAt?: number) => {
      const node = buttonRef.current;
      if (node) {
        /* Flip above when the list would run past the viewport.
           296px is the list's max height plus its margin. */
        const below = window.innerHeight - node.getBoundingClientRect().bottom;
        setFlip(below < 296 && node.getBoundingClientRect().top > below);
      }
      setActive(startAt ?? (selectedIndex >= 0 ? selectedIndex : 0));
      setOpen(true);
    },
    [selectedIndex],
  );

  const close = useCallback((refocus = true) => {
    setOpen(false);
    setActive(-1);
    if (refocus) buttonRef.current?.focus();
  }, []);

  const commit = useCallback(
    (i: number) => {
      if (i < 0 || i >= options.length) return;
      setValue(options[i]);
      close();
    },
    [options, close],
  );

  /* ---- dismissal ----------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        /* No refocus — the pointer is already somewhere else,
           and yanking focus back would fight the user. */
        setOpen(false);
        setActive(-1);
      }
    };
    /* A dropdown pinned to its trigger has to go when the page
       moves under it. */
    const onScroll = () => close(false);

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close]);

  /* Keep the active option in view without moving DOM focus. */
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current
      ?.querySelector(`#${CSS.escape(optionId(active))}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- typeahead ----------------------------------------- */
  const typeahead = useCallback(
    (key: string) => {
      const now = Date.now();
      const t = typed.current;
      t.buffer = now - t.at > TYPEAHEAD_MS ? key : t.buffer + key;
      t.at = now;

      const from = (open ? active : selectedIndex) + 1;
      const order = [
        ...options.slice(from),
        ...options.slice(0, Math.max(0, from)),
      ];
      const hit = order.find((o) =>
        o.toLowerCase().startsWith(t.buffer.toLowerCase()),
      );
      if (hit === undefined) return;

      const i = options.indexOf(hit);
      if (open) setActive(i);
      else setValue(hit);
    },
    [open, active, selectedIndex, options],
  );

  /* ---- keyboard ------------------------------------------ */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          /* Alt+Down opens without changing the value; plain
             Down steps it, as a native select does. */
          if (e.altKey) openList();
          else if (selectedIndex < last) setValue(options[selectedIndex + 1]);
          else if (selectedIndex < 0) setValue(options[0]);
        } else setActive((i) => Math.min(last, i + 1));
        return;

      case "ArrowUp":
        e.preventDefault();
        if (!open) {
          if (e.altKey) openList();
          else if (selectedIndex > 0) setValue(options[selectedIndex - 1]);
        } else setActive((i) => Math.max(0, i - 1));
        return;

      case "Home":
        if (!open) return;
        e.preventDefault();
        setActive(0);
        return;

      case "End":
        if (!open) return;
        e.preventDefault();
        setActive(last);
        return;

      case "Enter":
        e.preventDefault();
        if (open) commit(active);
        else openList();
        return;

      case " ":
        /* Space is typeahead once a word is in progress, and
           open/commit otherwise. */
        if (typed.current.buffer && Date.now() - typed.current.at < TYPEAHEAD_MS) break;
        e.preventDefault();
        if (open) commit(active);
        else openList();
        return;

      case "Escape":
        if (!open) return;
        e.preventDefault();
        close();
        return;

      case "Tab":
        if (open) close(false);
        return;
    }

    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      typeahead(e.key);
    }
  };

  const hasValue = value !== "";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* What the form actually submits. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-field={name}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border",
          "bg-[var(--surface-panel)] px-3.5 py-2.5 text-left",
          "font-body text-[0.9375rem]",
          "transition-[border-color,box-shadow] duration-180 outline-none",
          "focus-visible:border-[var(--surface-accent)]",
          "focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--surface-accent)_20%,transparent)]",
          hasValue ? "text-[var(--surface-fg)]" : "text-[var(--surface-muted)]",
          invalid
            ? "border-[var(--surface-accent)]"
            : "border-[var(--surface-rule)]",
        )}
      >
        <span className="truncate">{hasValue ? value : placeholder}</span>
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "size-3.5 shrink-0 text-[var(--surface-muted)] transition-transform duration-200",
            open && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3.5 6.5 8 11l4.5-4.5" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={cn(
            "absolute z-50 max-h-[18rem] w-full overflow-y-auto overscroll-contain",
            "rounded-lg border border-[var(--surface-rule)] bg-[var(--surface-raised)]",
            "p-1 shadow-[var(--surface-lift)]",
            flip ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {options.map((o, i) => {
            const isSelected = o === value;
            const isActive = i === active;
            return (
              /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
              <li
                key={o}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                /* pointerdown, not click: the dismissal handler
                   also listens for pointerdown, and on mouseup
                   ordering the list would be gone before click
                   ever landed. */
                onPointerDown={(e) => {
                  e.preventDefault();
                  commit(i);
                }}
                onPointerEnter={() => setActive(i)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2",
                  "text-[0.9375rem] text-[var(--surface-fg)]",
                  isActive && "bg-[var(--surface-sunken)]",
                )}
              >
                <span className="truncate">{o}</span>
                {/* A tick as well as the highlight — the active
                    row and the chosen row are different things
                    and must not be told apart by shading alone. */}
                {isSelected ? (
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m3 8.5 3.5 3.5L13 5" />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
