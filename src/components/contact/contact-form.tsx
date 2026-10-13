"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/lib/actions";
import { initialEnquiryState, type EnquiryField } from "@/lib/enquiry";
import { helpTopics } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/icons";
import { Select } from "@/components/ui/select";

/* ============================================================
   CONTACT FORM
   ------------------------------------------------------------
   Five fields, four required: name, work email, company
   (optional), what you'd like help with, and the requirement.

   Accessibility, all deliberate:
   · Every field has a real visible <label>. No placeholder-only
     labels anywhere.
   · Errors sit below their field, referenced by
     aria-describedby and marked aria-invalid.
   · A summary at the top links to each invalid field, and focus
     moves to the first one after a failed submit.
   · The status region is aria-live, so the result is announced
     without stealing focus.
   · The submit button disables while pending and says so.

   The success state is honest that nothing was transmitted —
   see actions.ts.
   ============================================================ */

export function ContactForm({ className }: { className?: string }) {
  const [state, action] = useActionState(submitEnquiry, initialEnquiryState);
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();
  const fieldId = (f: EnquiryField) => `${baseId}-${f}`;
  const errorId = (f: EnquiryField) => `${baseId}-${f}-error`;

  const errorEntries = Object.entries(state.errors) as [EnquiryField, string][];

  useEffect(() => {
    if (state.status !== "error" || errorEntries.length === 0) return;
    const field = errorEntries[0][0];
    const node =
      formRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`) ??
      formRef.current?.querySelector<HTMLElement>(
        `[name="${field}"]:not([type="hidden"])`,
      );
    node?.focus();
  }, [state, errorEntries]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "rounded-2xl border border-[var(--surface-accent)]/45 px-6 py-8 sm:px-8 sm:py-10",
          className,
        )}
      >
        <p className="text-[0.75rem] tracking-[0.14em] text-[var(--surface-accent-strong)] uppercase">
          Validated
        </p>
        <p className="text-d3 mt-4 font-display">
          Thanks — that&rsquo;s enough to start.
        </p>
        <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--surface-muted)]">
          {state.message}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-7 inline-flex min-h-11 items-center rounded-full border border-[var(--surface-rule)] px-5 text-sm transition-colors hover:border-[var(--surface-fg)]/50"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      className={className}
      aria-describedby={`${baseId}-status`}
    >
      {state.status === "error" && errorEntries.length > 0 ? (
        <div
          role="alert"
          className="mb-8 rounded-r-md border-l-2 border-[var(--surface-accent)] bg-[var(--surface-accent)]/[0.07] px-5 py-4"
        >
          <p className="text-[0.75rem] tracking-[0.14em] text-[var(--surface-accent-strong)] uppercase">
            {errorEntries.length} field{errorEntries.length > 1 ? "s" : ""} need
            checking
          </p>
          <ul className="mt-2.5 space-y-1">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${fieldId(field)}`}
                  className="text-[0.8125rem] underline decoration-1 underline-offset-4"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          name="name"
          label="Name"
          required
          autoComplete="name"
          defaultValue={state.values.name}
          error={state.errors.name}
        />

        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          name="email"
          label="Work email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.errors.email}
        />

        <div className="sm:col-span-2">
          <Field
            id={fieldId("company")}
            errorId={errorId("company")}
            name="company"
            label="Company"
            hint="Optional"
            autoComplete="organization"
            defaultValue={state.values.company}
            error={state.errors.company}
          />
        </div>

        <div className="sm:col-span-2">
          <SelectField
            id={fieldId("topic")}
            errorId={errorId("topic")}
            name="topic"
            label="What would you like help with?"
            required
            options={helpTopics}
            placeholder="Select the closest match"
            defaultValue={state.values.topic}
            error={state.errors.topic}
          />
        </div>

        <div className="sm:col-span-2">
          <Field
            id={fieldId("message")}
            errorId={errorId("message")}
            name="message"
            label="Brief description of the requirement"
            required
            multiline
            hint="What is not working today, or what would you like to build?"
            defaultValue={state.values.message}
            error={state.errors.message}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Submit />
        <p
          id={`${baseId}-status`}
          aria-live="polite"
          className="max-w-[34ch] text-[0.75rem] text-[var(--surface-muted)]"
        >
          Required fields are marked with an asterisk.
        </p>
      </div>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group inline-flex min-h-12 items-center gap-2.5 rounded-lg px-6",
        "font-display text-[0.9375rem] font-medium tracking-[-0.005em]",
        "bg-[var(--surface-cta-bg)] text-[var(--surface-cta-fg)] shadow-[var(--btn-lift)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-px hover:shadow-[var(--btn-lift-hover)]",
        "disabled:pointer-events-none disabled:opacity-60",
      )}
    >
      {pending ? "Sending…" : "Start a Conversation"}
      {pending ? (
        <span
          aria-hidden="true"
          className="block size-3.5 animate-spin rounded-full border border-current/30 border-t-current"
        />
      ) : (
        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------
   Fields
   ------------------------------------------------------------ */

const controlClass =
  "mt-2 block w-full min-h-11 rounded-lg border bg-[var(--surface-panel)] px-3.5 py-2.5 " +
  "font-body text-[0.9375rem] text-[var(--surface-fg)] " +
  "transition-[border-color,box-shadow] duration-180 outline-none " +
  "placeholder:text-[var(--surface-muted)] " +
  "focus:border-[var(--surface-accent)] " +
  "focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--surface-accent)_20%,transparent)]";

function Label({
  htmlFor,
  id,
  label,
  required,
  hint,
}: {
  htmlFor: string;
  /* The custom select is a <button>, which `for` cannot point
     at, so it is named by this id instead. */
  id?: string;
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <label htmlFor={htmlFor} id={id} className="text-[0.8125rem] font-medium">
        {label}
        {required ? (
          <span
            aria-hidden="true"
            className="ml-1 text-[var(--surface-accent-strong)]"
          >
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <span className="text-[0.75rem] text-[var(--surface-muted)]">
          {hint}
        </span>
      ) : null}
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-2 text-[0.8125rem] leading-snug text-[var(--surface-accent-strong)]"
    >
      {/* an icon as well as colour — never colour alone */}
      <svg
        viewBox="0 0 16 16"
        className="mt-[0.2em] size-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        aria-hidden="true"
      >
        <path d="M8 1.5 15 14.5H1z" />
        <path d="M8 6v4" />
        <path d="M8 12h.01" />
      </svg>
      {message}
    </p>
  );
}

function Field({
  id,
  errorId,
  name,
  label,
  required,
  hint,
  error,
  multiline,
  defaultValue,
  ...rest
}: {
  id: string;
  errorId: string;
  name: EnquiryField;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  multiline?: boolean;
  defaultValue?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const shared = {
    id,
    name,
    required,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(
      controlClass,
      error ? "border-[var(--surface-accent)]" : "border-[var(--surface-rule)]",
    ),
  };

  return (
    <div>
      <Label htmlFor={id} label={label} required={required} hint={hint} />
      {multiline ? (
        <textarea
          {...shared}
          rows={5}
          className={cn(shared.className, "resize-y")}
        />
      ) : (
        <input {...shared} {...rest} />
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function SelectField({
  id,
  errorId,
  name,
  label,
  options,
  placeholder,
  required,
  error,
  defaultValue,
}: {
  id: string;
  errorId: string;
  name: EnquiryField;
  label: string;
  options: readonly string[];
  placeholder: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
}) {
  const labelId = `${id}-label`;
  return (
    <div>
      <Label htmlFor={id} id={labelId} label={label} required={required} />
      <Select
        id={id}
        name={name}
        labelledBy={labelId}
        options={options}
        placeholder={placeholder}
        defaultValue={defaultValue}
        invalid={Boolean(error)}
        describedBy={error ? errorId : undefined}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
