"use server";

import type { EnquiryField, EnquiryState } from "./enquiry";

/* ============================================================
   ENQUIRY SUBMISSION
   ------------------------------------------------------------
   Server-side validation returning field-level errors.

   It is NOT connected to a mailbox, CRM or database. The brief
   is explicit: do not imply a message has been delivered if
   submission is not working. So the success state says, in
   plain words, that nothing was sent — which is annoying to
   read and far better than losing someone's enquiry silently.

   TO GO LIVE: replace the marked block with a real transport.
   The validated `values` object is everything it needs, and
   the success copy in contact-form.tsx should change at the
   same time.
   ============================================================ */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const read = (field: EnquiryField) =>
    (formData.get(field) as string | null)?.trim() ?? "";

  const values: Record<EnquiryField, string> = {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    topic: read("topic"),
    message: read("message"),
  };

  const errors: Partial<Record<EnquiryField, string>> = {};

  if (values.name.length < 2) {
    errors.name = "Enter your name so we know who we are replying to.";
  }
  if (!values.email) {
    errors.email = "Enter a work email address so we can reply.";
  } else if (!EMAIL.test(values.email)) {
    errors.email = "That address is missing an @ or a domain. Check it over.";
  }
  if (!values.topic) {
    errors.topic = "Pick the closest match. You can correct it below.";
  }
  if (values.message.length < 20) {
    errors.message =
      "A couple of sentences about the requirement is enough — around 20 characters minimum.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Some details need checking before this can be sent.",
      errors,
      values,
    };
  }

  /* ---------- REPLACE THIS BLOCK TO GO LIVE ----------
     e.g.  await sendEnquiryEmail(values)
     Until a destination exists nothing is transmitted or
     stored, and the confirmation says so.
     --------------------------------------------------- */

  return {
    status: "success",
    message:
      "Your details passed validation, but this form is not connected to a mailbox yet — so nothing has actually been sent. Please use a direct channel until this is wired up.",
    errors: {},
    values: {},
  };
}
