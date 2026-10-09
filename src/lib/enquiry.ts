/* ============================================================
   ENQUIRY TYPES + INITIAL STATE
   ------------------------------------------------------------
   Kept out of actions.ts on purpose: a "use server" module may
   only export async functions, so constants and types have to
   live in a plain module or they are stripped to undefined at
   build time.
   ============================================================ */

export type EnquiryField =
  | "name"
  | "email"
  | "company"
  | "topic"
  | "message";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: Partial<Record<EnquiryField, string>>;
  /** Echoed back so the form can repopulate after a failure. */
  values: Partial<Record<EnquiryField, string>>;
};

export const initialEnquiryState: EnquiryState = {
  status: "idle",
  message: "",
  errors: {},
  values: {},
};
