/**
 * Probes Greenhouse, Lever, and Ashby public APIs for company board slugs.
 * Run: npx tsx scripts/discover-ats.ts
 */

type AtsHit = {
  company: string;
  ats: "greenhouse" | "lever" | "ashby";
  slug: string;
  jobCount: number;
};

const EXISTING = new Set([
  "amazon",
  "microsoft",
  "google",
  "meta",
  "apple",
  "netflix",
]);

const TARGET_COMPANIES: Array<{ name: string; slugs: string[] }> = [
  { name: "Databricks", slugs: ["databricks"] },
  { name: "Palantir", slugs: ["palantir"] },
  { name: "Datadog", slugs: ["datadog"] },
  { name: "Snowflake", slugs: ["snowflake"] },
  { name: "Ramp", slugs: ["ramp"] },
  { name: "Plaid", slugs: ["plaid", "plaidinc"] },
  { name: "Brex", slugs: ["brex"] },
  { name: "Confluent", slugs: ["confluent"] },
  { name: "MongoDB", slugs: ["mongodb"] },
  { name: "Robinhood", slugs: ["robinhood"] },
  { name: "Nvidia", slugs: ["nvidia"] },
  { name: "Applied Intuition", slugs: ["appliedintuition"] },
  { name: "Anduril", slugs: ["andurilindustries", "anduril"] },
  { name: "Stripe", slugs: ["stripe"] },
  { name: "CoreWeave", slugs: ["coreweave"] },
  { name: "Pure Storage", slugs: ["purestorage"] },
  { name: "ServiceNow", slugs: ["servicenow"] },
  { name: "Uber", slugs: ["uber"] },
  { name: "DoorDash", slugs: ["doordash"] },
  { name: "Wiz", slugs: ["wizinc", "wiz"] },
  { name: "Glean", slugs: ["gleanwork", "glean"] },
  { name: "Waymo", slugs: ["waymo"] },
  { name: "Salesforce", slugs: ["salesforce"] },
  { name: "Airbnb", slugs: ["airbnb"] },
  { name: "Atlassian", slugs: ["atlassian"] },
  { name: "CrowdStrike", slugs: ["crowdstrike"] },
  { name: "Dropbox", slugs: ["dropbox"] },
  { name: "Coinbase", slugs: ["coinbase"] },
  { name: "Capital One", slugs: ["capitalone"] },
  { name: "Amex", slugs: ["americanexpress", "amex"] },
  { name: "JP Morgan", slugs: ["jpmorgan", "jpmorganchase"] },
  { name: "Morgan Stanley", slugs: ["morganstanley"] },
  { name: "Adobe", slugs: ["adobe"] },
  { name: "Instacart", slugs: ["instacart"] },
  { name: "Rippling", slugs: ["rippling"] },
  { name: "Toast", slugs: ["toast"] },
  { name: "Okta", slugs: ["okta"] },
  { name: "LinkedIn", slugs: ["linkedin"] },
  { name: "PayPal", slugs: ["paypal"] },
  { name: "Figma", slugs: ["figma"] },
  { name: "TikTok", slugs: ["tiktok", "bytedance"] },
  { name: "Asana", slugs: ["asana"] },
  { name: "Pinterest", slugs: ["pinterest"] },
  { name: "Lyft", slugs: ["lyft"] },
  { name: "Notion", slugs: ["notion"] },
  { name: "Airtable", slugs: ["airtable"] },
  { name: "Vercel", slugs: ["vercel"] },
  { name: "Saronic Technologies", slugs: ["saronic"] },
  { name: "Nuro", slugs: ["nuro"] },
  { name: "Databento", slugs: ["databento"] },
  { name: "Bilt", slugs: ["biltrewards", "bilt"] },
  { name: "Oracle", slugs: ["oracle"] },
  { name: "Snap", slugs: ["snap", "snapchat"] },
  { name: "Intel", slugs: ["intel"] },
  { name: "Warp", slugs: ["warp", "warpdev"] },
  { name: "Attentive", slugs: ["attentive"] },
  { name: "Perplexity", slugs: ["perplexityai", "perplexity"] },
  { name: "OpenAI", slugs: ["openai"] },
  { name: "Deel", slugs: ["deel"] },
  { name: "Gusto", slugs: ["gusto"] },
  { name: "Roblox", slugs: ["roblox"] },
  { name: "Kalshi", slugs: ["kalshi"] },
  { name: "Kraken", slugs: ["kraken"] },
  { name: "Gemini Exchange", slugs: ["gemini", "geminicrypto"] },
  { name: "Mercor", slugs: ["mercor"] },
  { name: "Chainguard", slugs: ["chainguard"] },
  { name: "Common Room", slugs: ["commonroom"] },
  { name: "Synctera", slugs: ["synctera"] },
  { name: "Underdog Sports", slugs: ["underdogfantasy", "underdog"] },
  { name: "Fireworks AI", slugs: ["fireworksai", "fireworks"] },
  { name: "ElevenLabs", slugs: ["elevenlabs"] },
  { name: "Inworld AI", slugs: ["inworldai", "inworld"] },
  { name: "Harvey AI", slugs: ["harvey", "harveyai"] },
  { name: "Vast Space", slugs: ["vastspace", "vast"] },
  { name: "Oklo", slugs: ["oklo"] },
  { name: "Citadel", slugs: ["citadel", "citadelsecurities"] },
  { name: "Five Rings", slugs: ["fiveringsllc", "fiverings"] },
  { name: "DRW", slugs: ["drw"] },
  { name: "IMC", slugs: ["imc"] },
  { name: "SIG", slugs: ["sig", "susquehanna"] },
  { name: "Akuna Capital", slugs: ["akunacapital", "akuna"] },
  { name: "Optiver", slugs: ["optiver"] },
  { name: "Jump Trading", slugs: ["jumptrading", "jump"] },
  { name: "HRT", slugs: ["hudsonrivertrading", "hrt"] },
  { name: "DE Shaw", slugs: ["deshaw", "deshawgroup"] },
  { name: "2Sigma", slugs: ["twosigma", "2sigma"] },
  { name: "XTX Markets", slugs: ["xtxmarkets", "xtx"] },
  { name: "Point72", slugs: ["point72"] },
  { name: "Virtu Financial", slugs: ["virtu", "virtufinancial"] },
  { name: "Old Mission Capital", slugs: ["oldmissioncapital", "oldmission"] },
  { name: "Radix Trading LLC", slugs: ["radixtrading", "radix"] },
  { name: "Belvedere Trading", slugs: ["belvederetrading", "belvedere"] },
  { name: "Jane Street", slugs: ["janestreet"] },
  { name: "Riot Games", slugs: ["riotgames", "riot"] },
  { name: "Spotify", slugs: ["spotify"] },
  { name: "GitHub", slugs: ["github"] },
  { name: "X", slugs: ["twitter", "x"] },
  { name: "Twitch", slugs: ["twitch"] },
  { name: "Zillow", slugs: ["zillow"] },
  { name: "Yelp", slugs: ["yelp"] },
  { name: "Discord", slugs: ["discord"] },
  { name: "Scale AI", slugs: ["scaleai", "scale"] },
  { name: "Crypto.com", slugs: ["crypto", "cryptocom"] },
  { name: "Polymarket", slugs: ["polymarket"] },
  { name: "Hugging Face", slugs: ["huggingface"] },
  { name: "Together AI", slugs: ["togetherai", "together"] },
  { name: "Mistral AI", slugs: ["mistralai", "mistral"] },
  { name: "Thinking Machines Lab", slugs: ["thinkingmachines", "tml"] },
  { name: "The Nuclear Company", slugs: ["thenuclearcompany", "tnc"] },
  { name: "Rigetti Computing", slugs: ["rigetti"] },
  { name: "UiPath", slugs: ["uipath"] },
  { name: "Anthropic", slugs: ["anthropic"] },
  { name: "Renaissance", slugs: ["rentec", "renaissance"] },
  { name: "Zynga", slugs: ["zynga"] },
  { name: "TextQL", slugs: ["textql"] },
  { name: "Cursor", slugs: ["cursor", "anysphere"] },
  { name: "Chime", slugs: ["chime"] },
  { name: "Tesla", slugs: ["tesla"] },
  { name: "Sofi", slugs: ["sofi"] },
  { name: "Revolut", slugs: ["revolut"] },
  { name: "Visa", slugs: ["visa"] },
  { name: "Intuit", slugs: ["intuit"] },
];

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

async function main() {
  const hits: AtsHit[] = [];
  const misses: string[] = [];

  for (const { name, slugs } of TARGET_COMPANIES) {
    const hit = await discoverCompany(name, slugs);
    if (hit) {
      hits.push(hit);
      console.log(
        `✓ ${hit.company.padEnd(28)} ${hit.ats.padEnd(12)} ${hit.slug} (${hit.jobCount} jobs)`,
      );
    } else {
      misses.push(name);
      console.log(`✗ ${name}`);
    }
  }

  console.log("\n--- SUMMARY ---");
  console.log(`Found: ${hits.length} / ${TARGET_COMPANIES.length}`);
  console.log(`Misses: ${misses.length}`);

  const byAts = {
    greenhouse: hits.filter((h) => h.ats === "greenhouse"),
    lever: hits.filter((h) => h.ats === "lever"),
    ashby: hits.filter((h) => h.ats === "ashby"),
  };
  console.log(
    `Greenhouse: ${byAts.greenhouse.length}, Lever: ${byAts.lever.length}, Ashby: ${byAts.ashby.length}`,
  );

  console.log("\n--- JSON ---");
  console.log(JSON.stringify({ hits, misses }, null, 2));
}

main().catch(console.error);
