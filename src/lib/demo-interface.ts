/* ============================================================
   ILLUSTRATIVE INTERFACE
   ------------------------------------------------------------
   One worked example of the kind of thing we build — a CRM
   pipeline view — used as the hero visual.

   It is a DEMONSTRATION, not a product. There is no product
   name on it, nothing here is for sale, and the component that
   renders it labels it as illustrative on the page itself. The
   company names are invented and obviously so.

   Rev 3 carried four of these, each written up as a named SaaS
   product with features, integrations and architecture pages.
   That was the largest overstatement on the site. One honest
   example makes the same point about capability.
   ============================================================ */

export type IconKey =
  | "grid"
  | "flow"
  | "check"
  | "box"
  | "truck"
  | "chart"
  | "cog"
  | "inbox"
  | "users"
  | "file"
  | "bell"
  | "shield"
  | "calendar"
  | "flask"
  | "cart"
  | "factory"
  | "database"
  | "plug"
  | "clock"
  | "layers"
  | "code"
  | "spark"
  | "phone"
  | "mail"
  | "pin";

export const demoInterface = {
  /** Generic on purpose — this is a view, not a brand. */
  appName: "Customer pipeline",
  nav: [
    { label: "Overview", icon: "grid" as IconKey },
    { label: "Contacts", icon: "users" as IconKey },
    { label: "Pipeline", icon: "flow" as IconKey },
    { label: "Tasks", icon: "check" as IconKey },
    { label: "Reports", icon: "chart" as IconKey },
  ],
  heading: "Sales pipeline",
  tiles: [
    { label: "Open enquiries", value: "48", delta: "+6 this week" },
    { label: "Awaiting follow-up", value: "12", delta: null },
    { label: "Won this month", value: "9", delta: "+2" },
  ],
  /** Pipeline stages, for the small stacked bar. */
  stages: [
    { label: "New", count: 18 },
    { label: "Qualified", count: 14 },
    { label: "Proposal", count: 9 },
    { label: "Won", count: 7 },
  ],
  rows: [
    { ref: "ENQ-204", name: "Northwind Logistics", stage: "Proposal", value: "Follow up Thu" },
    { ref: "ENQ-198", name: "Cedar & Rowe", stage: "Qualified", value: "Call booked" },
    { ref: "ENQ-191", name: "Haldor Group", stage: "New", value: "Needs scoping" },
  ],
} as const;
