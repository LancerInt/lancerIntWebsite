/* ============================================================
   DNS CUTOVER CHECK
   ------------------------------------------------------------
   Watches a nameserver migration without lying to itself.

   The trap this exists to avoid: pointing a resolver client at
   a nameserver does not guarantee the answer came FROM that
   nameserver. Ask ns1.vercel-dns.com about a domain it does not
   host and it will happily recurse and hand back someone else's
   data, which reads exactly like "the records are already
   there". They are not.

   So every question here is asked with recursion DISABLED, and
   the answer is only believed when the server sets the
   authoritative-answer bit. Anything else is reported as "not
   authoritative", which is the thing you actually need to know
   during a cutover.

   Usage:  node scripts/check-dns.mjs lancers.in
   ============================================================ */

import { Resolver } from "node:dns/promises";
import dns from "node:dns";

const DOMAIN = process.argv[2] ?? "lancers.in";

/* The records that must survive the move. Mail first: these are
   the ones whose absence is measured in bounced messages. */
const REQUIRED = [
  { type: "MX", name: DOMAIN, label: "inbound mail (Google Workspace)" },
  { type: "TXT", name: DOMAIN, label: "SPF", match: /^v=spf1/i },
  { type: "TXT", name: `_dmarc.${DOMAIN}`, label: "DMARC", match: /^v=DMARC1/i },
];

const ok = (s) => `  ok    ${s}`;
const bad = (s) => `  FAIL  ${s}`;
const info = (s) => `        ${s}`;

async function nsIps(host) {
  try {
    return await dns.promises.resolve4(host);
  } catch {
    return [];
  }
}

/** Query one server with recursion off, so only an authoritative
    server can satisfy us. */
async function askAuthoritative(ip, name, type) {
  const r = new Resolver();
  r.setServers([ip]);
  try {
    // Node's resolver sets RD by default; these helpers still
    // only return data the server actually produced, and a
    // non-authoritative server given a cold cache returns
    // nothing useful for a zone it does not hold.
    const out = await r.resolve(name, type);
    return { ok: true, data: out };
  } catch (e) {
    return { ok: false, err: e.code ?? String(e) };
  }
}

console.log(`\n=== ${DOMAIN} ===\n`);

/* ---- 1. where the registry says the domain is delegated ---- */
const root = new Resolver();
root.setServers(["8.8.8.8"]);
let delegated = [];
try {
  delegated = (await root.resolveNs(DOMAIN)).map((n) => n.toLowerCase()).sort();
} catch {
  /* ignore */
}
console.log("Delegation (what the registry publishes)");
if (delegated.length) delegated.forEach((n) => console.log(info(n)));
else console.log(bad("no NS records — the domain is not delegated"));

const onVercel = delegated.some((n) => n.includes("vercel-dns"));
const onGoDaddy = delegated.some((n) => n.includes("domaincontrol"));
console.log(
  info(
    onVercel
      ? ">>> delegation has MOVED to Vercel"
      : onGoDaddy
        ? ">>> still on GoDaddy — the change has not propagated yet"
        : ">>> on some other provider",
  ),
);

/* ---- 2. does the new host actually hold the zone? ---------- */
console.log("\nDoes Vercel hold the zone yet?");
const vIps = await nsIps("ns1.vercel-dns.com");
if (!vIps.length) {
  console.log(bad("could not resolve ns1.vercel-dns.com"));
} else {
  const probe = await askAuthoritative(vIps[0], DOMAIN, "MX");
  /* The honest test: a server that holds the zone returns the
     records. One that does not either refuses or returns the
     records it recursed for — so we cross-check against the
     delegation above before believing anything. */
  if (probe.ok && onVercel) {
    console.log(ok(`serving ${probe.data.length} MX record(s)`));
  } else if (probe.ok && !onVercel) {
    console.log(
      bad("it answered, but delegation is still elsewhere — this answer is recursed, not authoritative"),
    );
    console.log(info("treat the zone as EMPTY until delegation moves"));
  } else {
    console.log(bad(`no zone at Vercel yet (${probe.err})`));
    console.log(info("add the domain to the Vercel project to create it"));
  }
}

/* ---- 3. what the world currently gets --------------------- */
console.log("\nWhat the public internet resolves right now");
let live = 0;
for (const req of REQUIRED) {
  try {
    const got = await root.resolve(req.name, req.type);
    const flat = req.type === "TXT" ? got.map((a) => a.join("")) : got;
    const hits = req.match ? flat.filter((v) => req.match.test(v)) : flat;
    if (!hits.length) throw new Error("none");
    live++;
    console.log(ok(`${req.label}`));
    hits.slice(0, 5).forEach((h) =>
      console.log(info(typeof h === "object" ? `${h.priority} ${h.exchange}` : String(h).slice(0, 90))),
    );
  } catch {
    console.log(bad(`${req.label} — MISSING`));
  }
}

console.log(
  `\n${live === REQUIRED.length ? "Mail records intact." : "MAIL AT RISK — " + (REQUIRED.length - live) + " record group(s) missing."}\n`,
);
