/**
 * Round 2: probes Greenhouse, Lever, Ashby, and Workday for the LinkedIn
 * following-list companies not yet in the catalog.
 * Run: npx tsx scripts/discover-ats-2.ts
 */

export {};

type AtsHit = {
  company: string;
  ats: "greenhouse" | "lever" | "ashby" | "workday";
  slug: string;
  jobCount: number;
  workday?: { tenant: string; site: string; wdInstance: string };
};

const TARGET_COMPANIES: Array<{ name: string; slugs: string[] }> = [
  { name: "Shapes Inc", slugs: ["shapesinc", "shapes"] },
  { name: "Affirm", slugs: ["affirm"] },
  { name: "SeatGeek", slugs: ["seatgeek"] },
  { name: "Google DeepMind", slugs: ["deepmind", "googledeepmind"] },
  { name: "Ironclad", slugs: ["ironcladhq", "ironclad"] },
  { name: "Stilta", slugs: ["stilta"] },
  { name: "Balyasny Asset Management", slugs: ["balyasny", "balyasnyassetmanagement", "bamfunds", "bam"] },
  { name: "Autosana", slugs: ["autosana"] },
  { name: "Nutanix", slugs: ["nutanix"] },
  { name: "GridCARE", slugs: ["gridcare"] },
  { name: "Config", slugs: ["config", "configapp"] },
  { name: "Stitch", slugs: ["stitch", "stitchmoney"] },
  { name: "Vizient", slugs: ["vizient"] },
  { name: "Accenture", slugs: ["accenture"] },
  { name: "GSK", slugs: ["gsk"] },
  { name: "Cerebras", slugs: ["cerebras", "cerebrassystems"] },
  { name: "Lindy", slugs: ["lindy", "lindyai"] },
  { name: "o11", slugs: ["o11", "o11ai"] },
  { name: "Viasat", slugs: ["viasat"] },
  { name: "Pindrop", slugs: ["pindrop", "pindropsecurity"] },
  { name: "Oddpool", slugs: ["oddpool"] },
  { name: "Check", slugs: ["check", "checkhq"] },
  { name: "HF0", slugs: ["hf0"] },
  { name: "Human Delta", slugs: ["humandelta"] },
  { name: "N47", slugs: ["n47"] },
  { name: "Raindrop", slugs: ["raindrop", "raindropai"] },
  { name: "Engine", slugs: ["engine", "enginehq"] },
  { name: "Ardent", slugs: ["ardent", "ardentai"] },
  { name: "Revyl", slugs: ["revyl"] },
  { name: "Linear", slugs: ["linear"] },
  { name: "Supercell", slugs: ["supercell"] },
  { name: "Synchrony", slugs: ["synchrony"] },
  { name: "Monk", slugs: ["monk"] },
  { name: "PathAI", slugs: ["pathai"] },
  { name: "Greptile", slugs: ["greptile"] },
  { name: "Parallel Web Systems", slugs: ["parallel", "parallelweb", "parallelwebsystems"] },
  { name: "Dust", slugs: ["dust", "dust-tt", "dusttt"] },
  { name: "Emergent", slugs: ["emergent", "emergentai", "emergentsh"] },
  { name: "Geordie AI", slugs: ["geordie", "geordieai"] },
  { name: "DualEntry", slugs: ["dualentry"] },
  { name: "Traversal", slugs: ["traversal", "traversalai"] },
  { name: "Resolve AI", slugs: ["resolveai", "resolve"] },
  { name: "Peec AI", slugs: ["peec", "peecai"] },
  { name: "Serval", slugs: ["serval", "servalai"] },
  { name: "Reducto", slugs: ["reducto", "reductoai"] },
  { name: "Futures First", slugs: ["futuresfirst"] },
  { name: "fileAI", slugs: ["fileai"] },
  { name: "Iru", slugs: ["iru"] },
  { name: "NetApp", slugs: ["netapp"] },
  { name: "Arcana", slugs: ["arcana"] },
  { name: "Shaped", slugs: ["shaped", "shapedai"] },
  { name: "Smartsheet", slugs: ["smartsheet"] },
  { name: "Rho", slugs: ["rho", "rhobusiness"] },
  { name: "Aaru", slugs: ["aaru"] },
  { name: "Cohere", slugs: ["cohere"] },
  { name: "Cloudflare", slugs: ["cloudflare"] },
  { name: "Stoke Space", slugs: ["stokespace", "stoke-space", "stoke"] },
  { name: "Figure", slugs: ["figureai", "figure"] },
  { name: "Palo Alto Networks", slugs: ["paloaltonetworks"] },
  { name: "micro1", slugs: ["micro1"] },
  { name: "Fiserv", slugs: ["fiserv"] },
  { name: "Qdrant", slugs: ["qdrant"] },
  { name: "The Better Money Company", slugs: ["thebettermoneycompany", "bettermoney"] },
  { name: "Eclypsium", slugs: ["eclypsium"] },
  { name: "Mariana Minerals", slugs: ["marianaminerals", "mariana"] },
  { name: "OpenGradient", slugs: ["opengradient"] },
  { name: "Lio", slugs: ["asklio", "lio"] },
  { name: "Concourse", slugs: ["concourse", "concoursefinance"] },
  { name: "Braintrust", slugs: ["braintrust", "braintrustdata"] },
  { name: "Handle", slugs: ["handle"] },
  { name: "Meridian AI", slugs: ["meridian", "meridianai"] },
  { name: "Protege", slugs: ["protege", "withprotege", "protegeai"] },
  { name: "Babylon Labs", slugs: ["babylonlabs", "babylonchain", "babylon"] },
  { name: "Nexxa.ai", slugs: ["nexxa", "nexxaai"] },
  { name: "Hilbert", slugs: ["hilbert"] },
  { name: "Treeline", slugs: ["treeline"] },
  { name: "Sentra", slugs: ["sentra"] },
  { name: "Pillar", slugs: ["pillar"] },
  { name: "Phylo", slugs: ["phylo"] },
  { name: "GitButler", slugs: ["gitbutler"] },
  { name: "Mega", slugs: ["mega"] },
  { name: "Airbase", slugs: ["airbase"] },
  { name: "Dex", slugs: ["dex", "getdex"] },
  { name: "QuiverAI", slugs: ["quiverai", "quiver"] },
  { name: "Preset", slugs: ["preset"] },
  { name: "Pluvo", slugs: ["pluvo"] },
  { name: "Composio", slugs: ["composio"] },
  { name: "Vanta", slugs: ["vanta"] },
  { name: "UpSmith", slugs: ["upsmith"] },
  { name: "Haladir", slugs: ["haladir"] },
  { name: "Reflex", slugs: ["reflex", "reflexdev"] },
  { name: "You.com", slugs: ["youdotcom", "you"] },
  { name: "Liquid AI", slugs: ["liquidai", "liquid"] },
  { name: "Luma", slugs: ["lumaai", "luma"] },
  { name: "Actively AI", slugs: ["actively", "activelyai"] },
  { name: "Hightouch", slugs: ["hightouch"] },
  { name: "Afterprime", slugs: ["afterprime"] },
  { name: "Veeva Systems", slugs: ["veeva", "veevasystems"] },
  { name: "Reflection AI", slugs: ["reflectionai", "reflection"] },
  { name: "Driver", slugs: ["driver", "driverai"] },
  { name: "Hyperliquid", slugs: ["hyperliquid"] },
  { name: "Rillet", slugs: ["rillet"] },
  { name: "Maybern", slugs: ["maybern"] },
  { name: "LPL Financial", slugs: ["lpl", "lplfinancial"] },
  { name: "Everpure", slugs: ["everpure", "pentair"] },
  { name: "TradersPost", slugs: ["traderspost"] },
  { name: "QuestDB", slugs: ["questdb"] },
  { name: "Redis", slugs: ["redis", "redislabs"] },
  { name: "Yugabyte", slugs: ["yugabyte"] },
  { name: "SingleStore", slugs: ["singlestore"] },
  { name: "PlanetScale", slugs: ["planetscale"] },
  { name: "Cockroach Labs", slugs: ["cockroachlabs", "cockroachdb"] },
  { name: "Clark Associates", slugs: ["clarkassociates"] },
  { name: "Timebeat", slugs: ["timebeat"] },
  { name: "OfferPilot", slugs: ["offerpilot"] },
  { name: "Y Combinator", slugs: ["ycombinator"] },
  { name: "Twilio", slugs: ["twilio"] },
];

/** Workday candidates probed only when GH/Lever/Ashby all miss. */
const WORKDAY_TARGETS: Array<{
  name: string;
  tenants: string[];
  sites: string[];
}> = [
  { name: "Nutanix", tenants: ["nutanix"], sites: ["Nutanix", "NutanixCareers", "External", "Careers"] },
  { name: "Viasat", tenants: ["viasat"], sites: ["ViasatCareers", "External", "Careers", "Viasat"] },
  { name: "Synchrony", tenants: ["synchrony", "syf"], sites: ["Synchrony_Careers", "SynchronyCareers", "External", "Careers"] },
  { name: "GSK", tenants: ["gsk"], sites: ["GSKCareers", "External", "Careers", "GSK"] },
  { name: "NetApp", tenants: ["netapp"], sites: ["NetAppCareers", "hrx_External", "External", "Careers", "NetApp"] },
  { name: "Fiserv", tenants: ["fiserv"], sites: ["EXT", "External", "Careers", "EXT_Global", "Fiserv"] },
  { name: "Palo Alto Networks", tenants: ["paloaltonetworks", "paloaltonetworks2"], sites: ["PaloAltoNetworks", "External", "Careers"] },
  { name: "LPL Financial", tenants: ["lpl", "lplfinancial"], sites: ["careers", "External", "Careers", "LPL"] },
  { name: "Accenture", tenants: ["accenture"], sites: ["AccentureCareers", "External", "Careers"] },
  { name: "Vizient", tenants: ["vizient"], sites: ["Vizient", "External", "Careers", "VizientCareers"] },
  { name: "Smartsheet", tenants: ["smartsheet"], sites: ["Smartsheet", "External", "Careers"] },
  { name: "Veeva Systems", tenants: ["veeva"], sites: ["Veeva", "External", "Careers"] },
  { name: "Affirm", tenants: ["affirm"], sites: ["External", "Careers", "Affirm"] },
];

const WD_INSTANCES = ["wd1", "wd2", "wd3", "wd5", "wd12", "wd103"];

const HEADERS = { "User-Agent": "Scout-Discovery/1.0" };

async function probeGreenhouse(slug: string): Promise<number | null> {
  try {
    const r = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
      { headers: HEADERS, signal: AbortSignal.timeout(8000) },
    );
    if (!r.ok) return null;
    const d = (await r.json()) as { jobs?: unknown[] };
    return d.jobs?.length ?? 0;
  } catch {
    return null;
  }
}

async function probeLever(slug: string): Promise<number | null> {
  try {
    const r = await fetch(
      `https://api.lever.co/v0/postings/${slug}?mode=json&limit=1`,
      { headers: HEADERS, signal: AbortSignal.timeout(8000) },
    );
    if (!r.ok) return null;
    const d = (await r.json()) as unknown[];
    return Array.isArray(d) ? d.length : null;
  } catch {
    return null;
  }
}

async function probeAshby(slug: string): Promise<number | null> {
  try {
    const r = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
      { headers: HEADERS, signal: AbortSignal.timeout(8000) },
    );
    if (!r.ok) return null;
    const d = (await r.json()) as { jobs?: unknown[] };
    return d.jobs?.length ?? 0;
  } catch {
    return null;
  }
}

async function probeWorkday(
  tenant: string,
  wdInstance: string,
  site: string,
): Promise<number | null> {
  try {
    const r = await fetch(
      `https://${tenant}.${wdInstance}.myworkdayjobs.com/wday/cxs/${tenant}/${site}/jobs`,
      {
        method: "POST",
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ appliedFacets: {}, limit: 1, offset: 0, searchText: "" }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!r.ok) return null;
    const d = (await r.json()) as { total?: number; jobPostings?: unknown[] };
    if (typeof d.total === "number" && d.total > 0) return d.total;
    return null;
  } catch {
    return null;
  }
}

async function discoverCompany(
  name: string,
  slugs: string[],
): Promise<AtsHit | null> {
  for (const slug of slugs) {
    const gh = await probeGreenhouse(slug);
    if (gh !== null && gh > 0) {
      return { company: name, ats: "greenhouse", slug, jobCount: gh };
    }
    const lever = await probeLever(slug);
    if (lever !== null && lever > 0) {
      return { company: name, ats: "lever", slug, jobCount: lever };
    }
    const ashby = await probeAshby(slug);
    if (ashby !== null && ashby > 0) {
      return { company: name, ats: "ashby", slug, jobCount: ashby };
    }
  }
  return null;
}

async function discoverWorkday(name: string): Promise<AtsHit | null> {
  const target = WORKDAY_TARGETS.find((t) => t.name === name);
  if (!target) return null;

  for (const tenant of target.tenants) {
    for (const wdInstance of WD_INSTANCES) {
      for (const site of target.sites) {
        const total = await probeWorkday(tenant, wdInstance, site);
        if (total !== null && total > 0) {
          return {
            company: name,
            ats: "workday",
            slug: tenant,
            jobCount: total,
            workday: { tenant, site, wdInstance },
          };
        }
      }
    }
  }
  return null;
}

async function main() {
  const hits: AtsHit[] = [];
  const misses: string[] = [];

  const queue = [...TARGET_COMPANIES];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length > 0) {
      const target = queue.shift();
      if (!target) break;
      let hit = await discoverCompany(target.name, target.slugs);
      if (!hit) {
        hit = await discoverWorkday(target.name);
      }
      if (hit) {
        hits.push(hit);
        const extra = hit.workday
          ? ` [${hit.workday.tenant}/${hit.workday.site}/${hit.workday.wdInstance}]`
          : "";
        console.log(
          `✓ ${hit.company.padEnd(28)} ${hit.ats.padEnd(12)} ${hit.slug} (${hit.jobCount} jobs)${extra}`,
        );
      } else {
        misses.push(target.name);
        console.log(`✗ ${target.name}`);
      }
    }
  });
  await Promise.all(workers);

  console.log("\n--- SUMMARY ---");
  console.log(`Found: ${hits.length} / ${TARGET_COMPANIES.length}`);
  console.log(`Misses (${misses.length}): ${misses.join(", ")}`);

  const fs = await import("node:fs");
  fs.writeFileSync(
    "scripts/discover-ats-2-results.json",
    JSON.stringify({ hits, misses }, null, 2),
  );
  console.log("\nWrote scripts/discover-ats-2-results.json");
}

main().catch(console.error);
