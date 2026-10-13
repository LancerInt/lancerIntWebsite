import type { IconKey } from "./demo-interface";

/* ============================================================
   ILLUSTRATIVE APPLICATIONS
   ------------------------------------------------------------
   Two worked examples of the kind of system we build, as data.
   The renderer in components/system/app-demo knows how to draw
   each block kind and nothing about the content, so a page is
   added here rather than in JSX.

   THESE ARE DEMONSTRATIONS, NOT PRODUCTS
   Nothing here is for sale. Every figure is invented, every
   account is "Account 01", and the window chrome carries a
   "Demo data" chip that cannot be dismissed. The section around
   it says the same thing in words.

   A NOTE ON THE NAMES
   The brief for this site ruled out naming products, because
   there were none. These two names came from the client with
   the designs, so they are treated as real. If that is wrong,
   change `wordmark` here — it is the only place either name is
   written, and nothing else needs editing.
   ============================================================ */

export type Tone = "ok" | "warn" | "info" | "neutral";

export type Pill = { label: string; tone: Tone };

export type StatItem = {
  label: string;
  value: string;
  sub: string;
  delta?: string;
  dir?: "up" | "down";
  icon: IconKey;
};

export type Cell =
  | string
  | { pill: Pill }
  | { progress: number }
  | { num: string; tone?: "pos" | "neg" };

export type Block =
  | { kind: "stats"; items: StatItem[] }
  | { kind: "line"; title: string; control?: string; labels: string[]; values: number[] }
  | { kind: "bars"; title: string; link?: boolean; labels: string[]; values: number[] }
  | {
      kind: "feed";
      title: string;
      link?: boolean;
      rows: { title: string; sub: string; meta: string; pill: Pill }[];
    }
  | {
      kind: "table";
      title?: string;
      link?: boolean;
      columns: string[];
      /** "r" right-aligns a column. Numbers belong on the right. */
      align?: ("l" | "r")[];
      rows: Cell[][];
    };

export type Page = {
  id: string;
  label: string;
  icon: IconKey;
  title: string;
  /** Each entry is one row of the grid; two blocks sit side by side. */
  rows: Block[][];
};

export type Group = { label: string; pages: Page[] };

export type DemoApp = {
  id: string;
  wordmark: { lead: string; trail: string };
  /** Which accent pair the app paints with. */
  accent: "emerald" | "azure";
  dateRange: string;
  groups: Group[];
};

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];

/* ------------------------------------------------------------
   KRIYA CRM
   ------------------------------------------------------------ */

const crmPages: Group[] = [
  {
    label: "Workspace",
    pages: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "grid",
        title: "Workspace overview",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "Accounts", value: "12", sub: "Total accounts", delta: "20%", dir: "up", icon: "users" },
                { label: "Follow-ups", value: "28", sub: "Open follow-ups", delta: "6%", dir: "down", icon: "calendar" },
                { label: "Sales Orders", value: "16", sub: "Confirmed orders", delta: "14%", dir: "up", icon: "file" },
                { label: "Samples", value: "9", sub: "Active samples", delta: "50%", dir: "up", icon: "flask" },
              ],
            },
          ],
          [
            {
              kind: "line",
              title: "Sales activity",
              control: "Last 12 weeks",
              labels: WEEKS,
              values: [22, 55, 78, 58, 81, 100, 125, 113, 101, 139, 158, 180],
            },
            {
              kind: "feed",
              title: "Recent activities",
              link: true,
              rows: [
                { title: "Account 01", sub: "Follow-up call completed", meta: "Oct 28, 2026", pill: { label: "Follow-up", tone: "warn" } },
                { title: "Account 02", sub: "Sales order confirmed", meta: "Oct 27, 2026", pill: { label: "Completed", tone: "ok" } },
                { title: "Account 03", sub: "Sample request submitted", meta: "Oct 26, 2026", pill: { label: "In progress", tone: "info" } },
                { title: "Account 01", sub: "Meeting completed", meta: "Oct 25, 2026", pill: { label: "Completed", tone: "ok" } },
                { title: "Account 04", sub: "Follow-up email sent", meta: "Oct 24, 2026", pill: { label: "Follow-up", tone: "warn" } },
              ],
            },
          ],
          [
            {
              kind: "table",
              title: "Top accounts by sales orders",
              link: true,
              columns: ["#", "Account", "Orders", "Value (USD)"],
              align: ["l", "l", "r", "r"],
              rows: [
                ["1", "Account 01", "6", { num: "125,000" }],
                ["2", "Account 02", "5", { num: "98,500" }],
                ["3", "Account 03", "3", { num: "54,200" }],
                ["4", "Account 04", "2", { num: "32,400" }],
                ["5", "Account 05", "2", { num: "28,750" }],
              ],
            },
            {
              kind: "table",
              title: "Open follow-ups",
              link: true,
              columns: ["Account", "Activity", "Due date", "Status"],
              rows: [
                ["Account 01", "Call", "Oct 29, 2026", { pill: { label: "Follow-up", tone: "warn" } }],
                ["Account 02", "Meeting", "Oct 30, 2026", { pill: { label: "In progress", tone: "info" } }],
                ["Account 03", "Send samples", "Oct 31, 2026", { pill: { label: "Follow-up", tone: "warn" } }],
                ["Account 04", "Proposal discussion", "Oct 28, 2026", { pill: { label: "In progress", tone: "info" } }],
                ["Account 05", "Check in", "Oct 27, 2026", { pill: { label: "Follow-up", tone: "warn" } }],
              ],
            },
          ],
        ],
      },
      {
        id: "accounts",
        label: "Accounts",
        icon: "users",
        title: "Accounts",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "Active", value: "12", sub: "Accounts in play", icon: "users" },
                { label: "New", value: "3", sub: "Added this month", delta: "2", dir: "up", icon: "spark" },
                { label: "Dormant", value: "4", sub: "No activity 60 days", icon: "clock" },
                { label: "Pipeline", value: "338k", sub: "Open value (USD)", delta: "9%", dir: "up", icon: "chart" },
              ],
            },
          ],
          [
            {
              kind: "table",
              columns: ["Account", "Owner", "Stage", "Orders", "Value (USD)"],
              align: ["l", "l", "l", "r", "r"],
              rows: [
                ["Account 01", "A. Rao", { pill: { label: "Negotiation", tone: "info" } }, "6", { num: "125,000" }],
                ["Account 02", "S. Menon", { pill: { label: "Qualified", tone: "ok" } }, "5", { num: "98,500" }],
                ["Account 03", "A. Rao", { pill: { label: "Proposal", tone: "warn" } }, "3", { num: "54,200" }],
                ["Account 04", "K. Iyer", { pill: { label: "Qualified", tone: "ok" } }, "2", { num: "32,400" }],
                ["Account 05", "S. Menon", { pill: { label: "New", tone: "neutral" } }, "2", { num: "28,750" }],
                ["Account 06", "K. Iyer", { pill: { label: "Proposal", tone: "warn" } }, "1", { num: "14,900" }],
              ],
            },
          ],
        ],
      },
      {
        id: "activities",
        label: "Activities",
        icon: "calendar",
        title: "Activities",
        rows: [
          [
            {
              kind: "feed",
              title: "This week",
              rows: [
                { title: "Account 01", sub: "Follow-up call completed", meta: "Oct 28, 2026", pill: { label: "Completed", tone: "ok" } },
                { title: "Account 03", sub: "Sample dispatch arranged", meta: "Oct 28, 2026", pill: { label: "In progress", tone: "info" } },
                { title: "Account 02", sub: "Quotation revised", meta: "Oct 27, 2026", pill: { label: "Completed", tone: "ok" } },
                { title: "Account 05", sub: "Introductory call booked", meta: "Oct 27, 2026", pill: { label: "Follow-up", tone: "warn" } },
                { title: "Account 04", sub: "Proposal discussion", meta: "Oct 26, 2026", pill: { label: "In progress", tone: "info" } },
                { title: "Account 06", sub: "First contact logged", meta: "Oct 26, 2026", pill: { label: "Completed", tone: "ok" } },
              ],
            },
            {
              kind: "bars",
              title: "Activity volume",
              labels: WEEKS,
              values: [14, 19, 16, 23, 21, 27, 24, 31, 28, 34, 30, 37],
            },
          ],
        ],
      },
      {
        id: "tasks",
        label: "Tasks",
        icon: "check",
        title: "Tasks",
        rows: [
          [
            {
              kind: "table",
              columns: ["Task", "Account", "Owner", "Due date", "Status"],
              rows: [
                ["Send revised quotation", "Account 02", "S. Menon", "Oct 29, 2026", { pill: { label: "In progress", tone: "info" } }],
                ["Prepare sample pack", "Account 03", "A. Rao", "Oct 30, 2026", { pill: { label: "Follow-up", tone: "warn" } }],
                ["Confirm delivery window", "Account 01", "A. Rao", "Oct 30, 2026", { pill: { label: "In progress", tone: "info" } }],
                ["Share product sheet", "Account 05", "K. Iyer", "Oct 31, 2026", { pill: { label: "Follow-up", tone: "warn" } }],
                ["Log meeting notes", "Account 04", "K. Iyer", "Oct 27, 2026", { pill: { label: "Completed", tone: "ok" } }],
              ],
            },
          ],
        ],
      },
    ],
  },
  {
    label: "Sales",
    pages: [
      {
        id: "products",
        label: "Products",
        icon: "box",
        title: "Products",
        rows: [
          [
            {
              kind: "table",
              columns: ["Code", "Product", "Grade", "Unit", "Price (USD)"],
              align: ["l", "l", "l", "l", "r"],
              rows: [
                ["PRD-01", "Item 01", { pill: { label: "Standard", tone: "neutral" } }, "kg", { num: "12.40" }],
                ["PRD-02", "Item 02", { pill: { label: "Premium", tone: "info" } }, "kg", { num: "18.90" }],
                ["PRD-03", "Item 03", { pill: { label: "Standard", tone: "neutral" } }, "litre", { num: "9.75" }],
                ["PRD-04", "Item 04", { pill: { label: "Premium", tone: "info" } }, "kg", { num: "22.10" }],
                ["PRD-05", "Item 05", { pill: { label: "Standard", tone: "neutral" } }, "unit", { num: "6.30" }],
              ],
            },
          ],
        ],
      },
      {
        id: "sales-orders",
        label: "Sales Orders",
        icon: "file",
        title: "Sales orders",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "Confirmed", value: "16", sub: "This month", delta: "14%", dir: "up", icon: "file" },
                { label: "Draft", value: "4", sub: "Awaiting approval", icon: "inbox" },
                { label: "Dispatched", value: "11", sub: "Left the plant", icon: "truck" },
                { label: "Value", value: "339k", sub: "Confirmed (USD)", delta: "11%", dir: "up", icon: "chart" },
              ],
            },
          ],
          [
            {
              kind: "table",
              columns: ["Order", "Account", "Status", "Fulfilment"],
              rows: [
                ["SO-1001", "Account 01", { pill: { label: "In production", tone: "info" } }, { progress: 75 }],
                ["SO-1002", "Account 02", { pill: { label: "Picking", tone: "warn" } }, { progress: 40 }],
                ["SO-1003", "Account 03", { pill: { label: "Completed", tone: "ok" } }, { progress: 100 }],
                ["SO-1004", "Account 04", { pill: { label: "In production", tone: "info" } }, { progress: 60 }],
                ["SO-1005", "Account 05", { pill: { label: "Confirmed", tone: "info" } }, { progress: 25 }],
              ],
            },
          ],
        ],
      },
      {
        id: "shipments",
        label: "Shipments",
        icon: "truck",
        title: "Shipments",
        rows: [
          [
            {
              kind: "table",
              columns: ["Consignment", "Order", "Destination", "Status", "ETA"],
              rows: [
                ["SH-4001", "SO-1001", "Coimbatore", { pill: { label: "In transit", tone: "info" } }, "Oct 30, 2026"],
                ["SH-4002", "SO-1003", "Chennai", { pill: { label: "Delivered", tone: "ok" } }, "Oct 26, 2026"],
                ["SH-4003", "SO-1004", "Bengaluru", { pill: { label: "Packed", tone: "warn" } }, "Nov 02, 2026"],
                ["SH-4004", "SO-1002", "Madurai", { pill: { label: "Booked", tone: "neutral" } }, "Nov 04, 2026"],
              ],
            },
          ],
        ],
      },
      {
        id: "samples",
        label: "Samples",
        icon: "flask",
        title: "Samples",
        rows: [
          [
            {
              kind: "table",
              columns: ["Reference", "Account", "Product", "Status", "Sent"],
              rows: [
                ["SM-201", "Account 03", "Item 02", { pill: { label: "In progress", tone: "info" } }, "Oct 26, 2026"],
                ["SM-202", "Account 05", "Item 01", { pill: { label: "Follow-up", tone: "warn" } }, "Oct 24, 2026"],
                ["SM-203", "Account 01", "Item 04", { pill: { label: "Approved", tone: "ok" } }, "Oct 20, 2026"],
                ["SM-204", "Account 06", "Item 03", { pill: { label: "Follow-up", tone: "warn" } }, "Oct 18, 2026"],
              ],
            },
            {
              kind: "feed",
              title: "Sample feedback",
              rows: [
                { title: "Account 01", sub: "Approved for trial order", meta: "Oct 23, 2026", pill: { label: "Completed", tone: "ok" } },
                { title: "Account 03", sub: "Requested a finer grade", meta: "Oct 27, 2026", pill: { label: "In progress", tone: "info" } },
                { title: "Account 05", sub: "No response yet", meta: "Oct 28, 2026", pill: { label: "Follow-up", tone: "warn" } },
              ],
            },
          ],
        ],
      },
    ],
  },
  {
    label: "Insights",
    pages: [
      {
        id: "documents",
        label: "Documents",
        icon: "layers",
        title: "Documents",
        rows: [
          [
            {
              kind: "table",
              columns: ["Document", "Account", "Type", "Updated"],
              rows: [
                ["Quotation Q-1182", "Account 02", { pill: { label: "Quotation", tone: "info" } }, "Oct 27, 2026"],
                ["Specification sheet", "Account 03", { pill: { label: "Technical", tone: "neutral" } }, "Oct 26, 2026"],
                ["Supply agreement", "Account 01", { pill: { label: "Contract", tone: "ok" } }, "Oct 22, 2026"],
                ["Proposal draft", "Account 04", { pill: { label: "Quotation", tone: "info" } }, "Oct 21, 2026"],
              ],
            },
          ],
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: "chart",
        title: "Reports",
        rows: [
          [
            {
              kind: "line",
              title: "Order value by week",
              control: "Last 12 weeks",
              labels: WEEKS,
              values: [18, 31, 29, 44, 52, 48, 63, 71, 66, 84, 92, 104],
            },
            {
              kind: "bars",
              title: "Orders by account",
              labels: ["A01", "A02", "A03", "A04", "A05", "A06"],
              values: [6, 5, 3, 2, 2, 1],
            },
          ],
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------
   LANCER ERP
   ------------------------------------------------------------ */

const erpPages: Group[] = [
  {
    label: "Operations",
    pages: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "grid",
        title: "Operations overview",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "Inventory", value: "1,240", sub: "Items in stock", icon: "box" },
                { label: "Orders", value: "320", sub: "Total orders", icon: "file" },
                { label: "Production", value: "18", sub: "Active work orders", icon: "factory" },
                { label: "Pending deliveries", value: "24", sub: "Awaiting shipment", icon: "truck" },
              ],
            },
          ],
          [
            {
              kind: "table",
              title: "Order status",
              link: true,
              columns: ["Order", "Customer", "Status", "Progress"],
              rows: [
                ["SO-1001", "Account 01", { pill: { label: "In production", tone: "info" } }, { progress: 75 }],
                ["SO-1002", "Account 02", { pill: { label: "Picking", tone: "warn" } }, { progress: 40 }],
                ["SO-1003", "Account 03", { pill: { label: "Completed", tone: "ok" } }, { progress: 100 }],
                ["SO-1004", "Account 04", { pill: { label: "In production", tone: "info" } }, { progress: 60 }],
                ["SO-1005", "Account 05", { pill: { label: "Confirmed", tone: "info" } }, { progress: 25 }],
              ],
            },
            {
              kind: "bars",
              title: "Stock levels",
              link: true,
              labels: WEEKS,
              values: [450, 600, 520, 650, 720, 655, 810, 735, 870, 1040, 950, 1090],
            },
          ],
          [
            {
              kind: "table",
              title: "Recent transactions",
              link: true,
              columns: ["Date", "Item", "Type", "Quantity", "Value (USD)"],
              align: ["l", "l", "l", "r", "r"],
              rows: [
                ["Oct 31, 2026", "Item 01", "Sale", { num: "-20", tone: "neg" }, { num: "2,400" }],
                ["Oct 30, 2026", "Item 02", "Purchase", { num: "+100", tone: "pos" }, { num: "5,800" }],
                ["Oct 29, 2026", "Item 03", "Production", { num: "-50", tone: "neg" }, { num: "1,750" }],
                ["Oct 28, 2026", "Item 04", "Sale", { num: "-10", tone: "neg" }, { num: "1,200" }],
                ["Oct 27, 2026", "Item 05", "Purchase", { num: "+200", tone: "pos" }, { num: "8,400" }],
              ],
            },
            {
              kind: "table",
              title: "Production overview",
              link: true,
              columns: ["Work order", "Product", "Status", "Progress"],
              rows: [
                ["WO-2001", "Item 01", { pill: { label: "In production", tone: "info" } }, { progress: 70 }],
                ["WO-2002", "Item 02", { pill: { label: "Completed", tone: "ok" } }, { progress: 100 }],
                ["WO-2003", "Item 03", { pill: { label: "Picking", tone: "warn" } }, { progress: 45 }],
                ["WO-2004", "Item 04", { pill: { label: "In production", tone: "info" } }, { progress: 65 }],
                ["WO-2005", "Item 05", { pill: { label: "Confirmed", tone: "info" } }, { progress: 30 }],
              ],
            },
          ],
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: "box",
        title: "Inventory",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "In stock", value: "1,240", sub: "Across 5 items", icon: "box" },
                { label: "Low stock", value: "2", sub: "Below reorder level", icon: "bell" },
                { label: "On order", value: "300", sub: "Inbound units", icon: "truck" },
                { label: "Stock value", value: "412k", sub: "At cost (USD)", icon: "chart" },
              ],
            },
          ],
          [
            {
              kind: "table",
              columns: ["Item", "On hand", "Reorder at", "Status", "Location"],
              align: ["l", "r", "r", "l", "l"],
              rows: [
                ["Item 01", { num: "320" }, { num: "150" }, { pill: { label: "Healthy", tone: "ok" } }, "Store A"],
                ["Item 02", { num: "180" }, { num: "200" }, { pill: { label: "Low", tone: "warn" } }, "Store A"],
                ["Item 03", { num: "410" }, { num: "150" }, { pill: { label: "Healthy", tone: "ok" } }, "Store B"],
                ["Item 04", { num: "90" }, { num: "120" }, { pill: { label: "Low", tone: "warn" } }, "Store B"],
                ["Item 05", { num: "240" }, { num: "100" }, { pill: { label: "Healthy", tone: "ok" } }, "Store C"],
              ],
            },
          ],
        ],
      },
      {
        id: "purchases",
        label: "Purchases",
        icon: "cart",
        title: "Purchases",
        rows: [
          [
            {
              kind: "table",
              columns: ["PO", "Supplier", "Item", "Status", "Value (USD)"],
              align: ["l", "l", "l", "l", "r"],
              rows: [
                ["PO-3001", "Supplier 01", "Item 02", { pill: { label: "Received", tone: "ok" } }, { num: "5,800" }],
                ["PO-3002", "Supplier 02", "Item 05", { pill: { label: "In transit", tone: "info" } }, { num: "8,400" }],
                ["PO-3003", "Supplier 01", "Item 04", { pill: { label: "Ordered", tone: "warn" } }, { num: "3,150" }],
                ["PO-3004", "Supplier 03", "Item 01", { pill: { label: "Draft", tone: "neutral" } }, { num: "2,900" }],
              ],
            },
          ],
        ],
      },
      {
        id: "sales",
        label: "Sales",
        icon: "file",
        title: "Sales",
        rows: [
          [
            {
              kind: "line",
              title: "Sales value by week",
              control: "Last 12 weeks",
              labels: WEEKS,
              values: [30, 44, 39, 58, 66, 61, 78, 71, 85, 97, 92, 110],
            },
            {
              kind: "feed",
              title: "Latest orders",
              rows: [
                { title: "SO-1005", sub: "Account 05 · 2 lines", meta: "Oct 31, 2026", pill: { label: "Confirmed", tone: "info" } },
                { title: "SO-1004", sub: "Account 04 · 4 lines", meta: "Oct 30, 2026", pill: { label: "In production", tone: "info" } },
                { title: "SO-1003", sub: "Account 03 · 1 line", meta: "Oct 29, 2026", pill: { label: "Completed", tone: "ok" } },
                { title: "SO-1002", sub: "Account 02 · 3 lines", meta: "Oct 28, 2026", pill: { label: "Picking", tone: "warn" } },
              ],
            },
          ],
        ],
      },
      {
        id: "production",
        label: "Production",
        icon: "factory",
        title: "Production",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "Active", value: "18", sub: "Work orders", icon: "factory" },
                { label: "Completed", value: "42", sub: "This month", delta: "8%", dir: "up", icon: "check" },
                { label: "On hold", value: "3", sub: "Awaiting material", icon: "clock" },
                { label: "Output", value: "6,310", sub: "Units this month", delta: "5%", dir: "up", icon: "chart" },
              ],
            },
          ],
          [
            {
              kind: "table",
              columns: ["Work order", "Product", "Line", "Status", "Progress"],
              rows: [
                ["WO-2001", "Item 01", "Line 1", { pill: { label: "In production", tone: "info" } }, { progress: 70 }],
                ["WO-2002", "Item 02", "Line 1", { pill: { label: "Completed", tone: "ok" } }, { progress: 100 }],
                ["WO-2003", "Item 03", "Line 2", { pill: { label: "Picking", tone: "warn" } }, { progress: 45 }],
                ["WO-2004", "Item 04", "Line 2", { pill: { label: "In production", tone: "info" } }, { progress: 65 }],
                ["WO-2005", "Item 05", "Line 3", { pill: { label: "Confirmed", tone: "info" } }, { progress: 30 }],
              ],
            },
          ],
        ],
      },
      {
        id: "quality",
        label: "Quality",
        icon: "shield",
        title: "Quality",
        rows: [
          [
            {
              kind: "table",
              columns: ["Check", "Batch", "Result", "Inspector", "Date"],
              rows: [
                ["Visual inspection", "B-9012", { pill: { label: "Passed", tone: "ok" } }, "R. Natarajan", "Oct 30, 2026"],
                ["Moisture content", "B-9011", { pill: { label: "Passed", tone: "ok" } }, "R. Natarajan", "Oct 29, 2026"],
                ["Tensile test", "B-9010", { pill: { label: "Re-test", tone: "warn" } }, "P. Shankar", "Oct 28, 2026"],
                ["Visual inspection", "B-9009", { pill: { label: "Passed", tone: "ok" } }, "P. Shankar", "Oct 27, 2026"],
              ],
            },
            {
              kind: "bars",
              title: "Checks per week",
              labels: WEEKS,
              values: [12, 15, 14, 18, 17, 21, 19, 24, 22, 26, 25, 29],
            },
          ],
        ],
      },
      {
        id: "finance",
        label: "Finance",
        icon: "database",
        title: "Finance",
        rows: [
          [
            {
              kind: "stats",
              items: [
                { label: "Receivables", value: "186k", sub: "Outstanding (USD)", icon: "inbox" },
                { label: "Payables", value: "94k", sub: "Due this month", icon: "file" },
                { label: "Invoiced", value: "339k", sub: "This month (USD)", delta: "11%", dir: "up", icon: "chart" },
                { label: "Overdue", value: "7", sub: "Invoices past due", delta: "2", dir: "down", icon: "clock" },
              ],
            },
          ],
          [
            {
              kind: "table",
              columns: ["Invoice", "Customer", "Status", "Due", "Amount (USD)"],
              align: ["l", "l", "l", "l", "r"],
              rows: [
                ["IN-7001", "Account 01", { pill: { label: "Paid", tone: "ok" } }, "Oct 20, 2026", { num: "42,000" }],
                ["IN-7002", "Account 02", { pill: { label: "Sent", tone: "info" } }, "Nov 05, 2026", { num: "31,600" }],
                ["IN-7003", "Account 03", { pill: { label: "Overdue", tone: "warn" } }, "Oct 15, 2026", { num: "18,900" }],
                ["IN-7004", "Account 04", { pill: { label: "Sent", tone: "info" } }, "Nov 09, 2026", { num: "12,450" }],
              ],
            },
          ],
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: "chart",
        title: "Reports",
        rows: [
          [
            {
              kind: "bars",
              title: "Output by week",
              labels: WEEKS,
              values: [380, 420, 405, 470, 510, 495, 560, 540, 610, 650, 625, 700],
            },
            {
              kind: "table",
              title: "Movement by type",
              columns: ["Type", "Entries", "Units"],
              align: ["l", "r", "r"],
              rows: [
                ["Purchase", { num: "38" }, { num: "+4,120" }],
                ["Production", { num: "61" }, { num: "+6,310" }],
                ["Sale", { num: "94" }, { num: "-7,480" }],
                ["Adjustment", { num: "12" }, { num: "-210" }],
              ],
            },
          ],
        ],
      },
    ],
  },
];

export const demoApps: DemoApp[] = [
  {
    id: "crm",
    wordmark: { lead: "Kriya", trail: "CRM" },
    accent: "emerald",
    dateRange: "Oct 1, 2026 – Oct 31, 2026",
    groups: crmPages,
  },
  {
    id: "erp",
    wordmark: { lead: "Lancer", trail: "ERP" },
    accent: "azure",
    dateRange: "Oct 1, 2026 – Oct 31, 2026",
    groups: erpPages,
  },
];

/** Flattened page list, in sidebar order. */
export function pagesOf(app: DemoApp): Page[] {
  return app.groups.flatMap((g) => g.pages);
}
