/* ============================================================
   SITE CONTENT
   ------------------------------------------------------------
   All homepage copy, in one file, matching the approved brief.

   The positioning this file encodes: a growing team building
   practical business software — CRM, ERP, workflow automation
   and custom applications — not an established vendor with a
   shelf of finished SaaS products.

   Nothing here asserts a client, a case study, a metric, an
   award, a certification, a team size, a founding year or a
   released product. If a fact is not known it is not here.
   ============================================================ */

/* --- Hero -------------------------------------------------- */

export const hero = {
  eyebrow: "Software · Business systems · Automation",
  lines: ["We build software", "around the way", "your business works."],
  /** Rendered in the accent colour. */
  accent: "your business works.",
  body: "From CRM and ERP systems to custom business applications, we help turn everyday operational challenges into practical, usable software.",
  primary: { label: "Discuss a Project", href: "/contact" },
  secondary: { label: "What We Can Build", href: "#what-we-do" },
} as const;

/* --- Introduction ------------------------------------------ */

export const intro = {
  eyebrow: "A practical approach to software",
  lines: ["Good software starts with", "understanding the problem."],
  accent: "understanding the problem.",
  paragraphs: [
    "Every business has its own way of working. Sometimes existing tools do not fit. Sometimes information is scattered across spreadsheets, messages, and disconnected systems. And sometimes a manual process is ready to become something better.",
    "We work with businesses to understand these challenges and build software that fits their actual needs.",
  ],
} as const;

/* --- What we do -------------------------------------------- */

export type Capability = {
  index: string;
  title: string;
  body: string;
  /** Icon key from the shared set. */
  icon: "users" | "database" | "flow" | "code" | "chart";
};

export const capabilitiesIntro = {
  eyebrow: "Our capabilities",
  lines: ["The systems behind", "better work."],
  accent: "better work.",
  body: "We develop and improve the digital tools businesses use to manage customers, operations, information, and everyday tasks.",
} as const;

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "CRM Systems",
    body: "Keep customer information, enquiries, follow-ups, and sales activities organized in one place. Build workflows around how your team actually manages relationships.",
    icon: "users",
  },
  {
    index: "02",
    title: "ERP and Business Applications",
    body: "Connect business processes and operational information through applications designed around your requirements, rather than forcing every process into a rigid template.",
    icon: "database",
  },
  {
    index: "03",
    title: "Workflow Automation",
    body: "Reduce repetitive data entry, manual handoffs, and avoidable follow-ups by connecting processes and automating suitable tasks.",
    icon: "flow",
  },
  {
    index: "04",
    title: "Custom Software",
    body: "When an off-the-shelf application does not fit, develop a focused tool or application for the specific problem your business needs to solve.",
    icon: "code",
  },
  {
    index: "05",
    title: "Integrations and Reporting",
    body: "Bring information together across compatible systems and make routine reporting easier to manage and understand.",
    icon: "chart",
  },
];

/* --- How we work ------------------------------------------- */

export const processIntro = {
  eyebrow: "From problem to working software",
  lines: ["Start with the problem.", "Build what makes sense."],
  accent: "Build what makes sense.",
} as const;

export const processSteps = [
  {
    index: "01",
    label: "Understand",
    body: "We learn how the current process works, where the friction occurs, and what a better outcome would look like.",
  },
  {
    index: "02",
    label: "Shape the solution",
    body: "We define the essential features, map the workflow, and agree on a practical starting scope.",
  },
  {
    index: "03",
    label: "Build and refine",
    body: "We develop the solution in manageable stages, review the results, and improve the details through feedback.",
  },
  {
    index: "04",
    label: "Put it to work",
    body: "We help prepare the solution for actual use and identify what should be improved next.",
  },
] as const;

/* --- Our approach ------------------------------------------ */

export const approach = {
  eyebrow: "Built through collaboration",
  lines: ["Useful first.", "Better with every iteration."],
  accent: "Better with every iteration.",
  paragraphs: [
    "We believe software should solve a real problem before it tries to do everything. That means starting with the essentials, testing ideas against actual workflows, and improving the solution as requirements become clearer.",
    "We value straightforward communication, thoughtful engineering, and software that people can understand and use.",
  ],
} as const;

/* --- Product direction -------------------------------------
   Deliberately unnamed. This is a statement of direction, not
   an announcement — so there is no product name, no feature
   list and no release language anywhere in it.
   ----------------------------------------------------------- */

export const productDirection = {
  eyebrow: "An idea taking shape",
  lines: ["Solving today's needs.", "Learning what to build next."],
  accent: "Learning what to build next.",
  paragraphs: [
    "Alongside our client-focused software work, we are exploring opportunities to develop our own products. Our focus is on recurring business challenges — particularly the way teams manage information, coordinate tasks, and run day-to-day operations.",
    "We are taking a practical approach: learn from real problems, identify what can be made simpler, and build when there is a clear reason to do so.",
  ],
  cta: { label: "Talk to Us About an Idea", href: "/contact" },
  /** The recurring problems we are paying attention to. */
  themes: [
    "Information spread across spreadsheets and inboxes",
    "Tasks coordinated by memory and follow-up",
    "The same report rebuilt by hand every week",
    "Processes that live in people rather than systems",
  ],
} as const;

/* --- About -------------------------------------------------- */

export const about = {
  eyebrow: "About Lancer International",
  lines: ["A growing team with a", "practical view of technology."],
  accent: "practical view of technology.",
  paragraphs: [
    "Lancer International is building its capabilities around a simple idea: technology should make business work easier to manage.",
    "We work on business applications and custom software with an emphasis on understanding the process, choosing the right approach, and delivering something useful.",
    "We are continuing to grow, learn, and explore where thoughtful software can make the greatest difference.",
  ],
  cta: { label: "Get to Know Us", href: "/about" },
} as const;

/* --- Contact ------------------------------------------------ */

export const contact = {
  eyebrow: "Have a business challenge?",
  lines: ["Let's work out what the", "right solution could be."],
  accent: "right solution could be.",
  body: "Tell us what you are trying to improve, what is not working today, or what you would like to build. We can start with a conversation about the problem and the options available.",
} as const;

/** Options for "What would you like help with?" */
export const helpTopics = [
  "CRM system",
  "ERP or business application",
  "Workflow automation",
  "Custom software",
  "Integrations or reporting",
  "Not sure yet",
] as const;
