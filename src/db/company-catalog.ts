import type { AdapterConfig } from "@/db/schema";

export type CatalogCompany = {
  name: string;
  slug: string;
  adapterKey: string;
  adapterConfig?: AdapterConfig;
  careersUrl: string;
  enabled?: boolean;
};

function gh(
  name: string,
  slug: string,
  board: string,
  careersUrl?: string,
): CatalogCompany {
  return {
    name,
    slug,
    adapterKey: "greenhouse",
    adapterConfig: { board },
    careersUrl: careersUrl ?? `https://job-boards.greenhouse.io/${board}`,
    enabled: true,
  };
}

function lever(name: string, slug: string, board: string): CatalogCompany {
  return {
    name,
    slug,
    adapterKey: "lever",
    adapterConfig: { board },
    careersUrl: `https://jobs.lever.co/${board}`,
    enabled: true,
  };
}

function ashby(name: string, slug: string, board: string): CatalogCompany {
  return {
    name,
    slug,
    adapterKey: "ashby",
    adapterConfig: { board },
    careersUrl: `https://jobs.ashbyhq.com/${board}`,
    enabled: true,
  };
}

function workday(
  name: string,
  slug: string,
  tenant: string,
  site: string,
  wdInstance = "wd5",
): CatalogCompany {
  return {
    name,
    slug,
    adapterKey: "workday",
    adapterConfig: { tenant, site, wdInstance },
    careersUrl: `https://${tenant}.${wdInstance}.myworkdayjobs.com/${site}`,
    enabled: true,
  };
}

function manual(name: string, slug: string, careersUrl: string): CatalogCompany {
  return {
    name,
    slug,
    adapterKey: "manual",
    careersUrl,
    enabled: false,
  };
}

/** Original FAANG/MAANG custom adapters */
export const LEGACY_COMPANIES: CatalogCompany[] = [
  {
    name: "Google",
    slug: "google",
    adapterKey: "google",
    careersUrl: "https://careers.google.com/jobs/results/",
  },
  {
    name: "Meta",
    slug: "meta",
    adapterKey: "meta",
    careersUrl: "https://www.metacareers.com/jobs",
  },
  {
    name: "Amazon",
    slug: "amazon",
    adapterKey: "amazon",
    careersUrl: "https://www.amazon.jobs/en/search",
  },
  {
    name: "Apple",
    slug: "apple",
    adapterKey: "apple",
    careersUrl: "https://jobs.apple.com/en-us/search",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    adapterKey: "microsoft",
    careersUrl: "https://careers.microsoft.com/us/en/search-results",
  },
  {
    name: "Netflix",
    slug: "netflix",
    adapterKey: "netflix",
    careersUrl: "https://explore.jobs.netflix.net/careers",
  },
];

export const GREENHOUSE_COMPANIES: CatalogCompany[] = [
  gh("Databricks", "databricks", "databricks"),
  gh("Datadog", "datadog", "datadog"),
  gh("Brex", "brex", "brex"),
  gh("MongoDB", "mongodb", "mongodb"),
  gh("Robinhood", "robinhood", "robinhood"),
  gh("Anduril", "anduril", "andurilindustries"),
  gh("Stripe", "stripe", "stripe"),
  gh("CoreWeave", "coreweave", "coreweave"),
  gh("Pure Storage", "pure-storage", "purestorage"),
  gh("Wiz", "wiz", "wizinc"),
  gh("Glean", "glean", "gleanwork"),
  gh("Waymo", "waymo", "waymo"),
  gh("Airbnb", "airbnb", "airbnb"),
  gh("Dropbox", "dropbox", "dropbox"),
  gh("Coinbase", "coinbase", "coinbase"),
  gh("Instacart", "instacart", "instacart"),
  gh("Toast", "toast", "toast"),
  gh("Okta", "okta", "okta"),
  gh("LinkedIn", "linkedin", "linkedin"),
  gh("Figma", "figma", "figma"),
  gh("Asana", "asana", "asana"),
  gh("Pinterest", "pinterest", "pinterest"),
  gh("Lyft", "lyft", "lyft"),
  gh("Airtable", "airtable", "airtable"),
  gh("Vercel", "vercel", "vercel"),
  gh("Nuro", "nuro", "nuro"),
  gh("Databento", "databento", "databento"),
  gh("Warp", "warp", "warp"),
  gh("Attentive", "attentive", "attentive"),
  gh("Gusto", "gusto", "gusto"),
  gh("Roblox", "roblox", "roblox"),
  gh("Kalshi", "kalshi", "kalshi"),
  gh("Gemini Exchange", "gemini-exchange", "gemini"),
  gh("Chainguard", "chainguard", "chainguard"),
  gh("Underdog Sports", "underdog-sports", "underdogfantasy"),
  gh("Fireworks AI", "fireworks-ai", "fireworksai"),
  gh("Vast Space", "vast-space", "vast"),
  gh("Oklo", "oklo", "oklo"),
  gh("Five Rings", "five-rings", "fiveringsllc"),
  gh("IMC", "imc", "imc"),
  gh("Akuna Capital", "akuna-capital", "akunacapital"),
  gh("Jump Trading", "jump-trading", "jumptrading"),
  gh("Point72", "point72", "point72"),
  gh("Virtu Financial", "virtu-financial", "virtu"),
  gh("Old Mission Capital", "old-mission-capital", "oldmissioncapital"),
  gh("Jane Street", "jane-street", "janestreet"),
  gh("Riot Games", "riot-games", "riotgames"),
  gh("Twitch", "twitch", "twitch"),
  gh("Discord", "discord", "discord"),
  gh("Scale AI", "scale-ai", "scaleai"),
  gh("Together AI", "together-ai", "togetherai"),
  gh("Thinking Machines Lab", "thinking-machines-lab", "thinkingmachines"),
  gh("The Nuclear Company", "the-nuclear-company", "thenuclearcompany"),
  gh("Anthropic", "anthropic", "anthropic"),
  gh("Chime", "chime", "chime"),
  gh("Sofi", "sofi", "sofi"),
];

export const LEVER_COMPANIES: CatalogCompany[] = [
  lever("Palantir", "palantir", "palantir"),
  lever("Belvedere Trading", "belvedere-trading", "belvederetrading"),
  lever("Spotify", "spotify", "spotify"),
  lever("Crypto.com", "crypto-com", "crypto"),
  lever("Mistral AI", "mistral-ai", "mistral"),
  lever("Rigetti Computing", "rigetti-computing", "rigetti"),
];

export const ASHBY_COMPANIES: CatalogCompany[] = [
  ashby("Snowflake", "snowflake", "snowflake"),
  ashby("Ramp", "ramp", "ramp"),
  ashby("Plaid", "plaid", "plaid"),
  ashby("Confluent", "confluent", "confluent"),
  ashby("Notion", "notion", "notion"),
  ashby("Saronic Technologies", "saronic-technologies", "saronic"),
  ashby("Perplexity", "perplexity", "perplexity"),
  ashby("OpenAI", "openai", "openai"),
  ashby("Mercor", "mercor", "mercor"),
  ashby("Common Room", "common-room", "commonroom"),
  ashby("Synctera", "synctera", "synctera"),
  ashby("ElevenLabs", "elevenlabs", "elevenlabs"),
  ashby("Harvey AI", "harvey-ai", "harvey"),
  ashby("Polymarket", "polymarket", "polymarket"),
  ashby("UiPath", "uipath", "uipath"),
  ashby("Cursor", "cursor", "cursor"),
];

export const WORKDAY_COMPANIES: CatalogCompany[] = [
  workday("Nvidia", "nvidia", "nvidia", "NVIDIAExternalCareerSite", "wd5"),
  workday("Salesforce", "salesforce", "salesforce", "External_Career_Site", "wd12"),
  workday("CrowdStrike", "crowdstrike", "crowdstrike", "crowdstrikecareers", "wd5"),
  workday("Adobe", "adobe", "adobe", "external_experienced", "wd5"),
  workday("Capital One", "capital-one", "capitalone", "Capital_One", "wd12"),
];

export const MANUAL_COMPANIES: CatalogCompany[] = [
  manual("Applied Intuition", "applied-intuition", "https://www.appliedintuition.com/careers"),
  manual("ServiceNow", "servicenow", "https://careers.servicenow.com/"),
  manual("Uber", "uber", "https://www.uber.com/us/en/careers/"),
  manual("DoorDash", "doordash", "https://careers.doordash.com/"),
  manual("Atlassian", "atlassian", "https://www.atlassian.com/company/careers"),
  manual("Amex", "amex", "https://www.americanexpress.com/en-us/careers/"),
  manual("JP Morgan", "jp-morgan", "https://careers.jpmorgan.com/"),
  manual("Morgan Stanley", "morgan-stanley", "https://www.morganstanley.com/careers"),
  manual("Rippling", "rippling", "https://www.rippling.com/careers"),
  manual("PayPal", "paypal", "https://careers.pypl.com/"),
  manual("TikTok", "tiktok", "https://careers.tiktok.com/"),
  manual("Bilt", "bilt", "https://www.biltrewards.com/careers"),
  manual("Oracle", "oracle", "https://www.oracle.com/careers/"),
  manual("Snap", "snap", "https://careers.snap.com/"),
  manual("Intel", "intel", "https://jobs.intel.com/"),
  manual("Deel", "deel", "https://www.deel.com/careers"),
  manual("Kraken", "kraken", "https://www.kraken.com/careers"),
  manual("Inworld AI", "inworld-ai", "https://inworld.ai/careers"),
  manual("Citadel", "citadel", "https://www.citadel.com/careers/"),
  manual("DRW", "drw", "https://www.drw.com/careers"),
  manual("SIG", "sig", "https://careers.sig.com/"),
  manual("Optiver", "optiver", "https://optiver.com/working-at-optiver/careers/"),
  manual("HRT", "hrt", "https://www.hudsonrivertrading.com/careers/"),
  manual("DE Shaw", "de-shaw", "https://www.deshaw.com/careers"),
  manual("2Sigma", "two-sigma", "https://www.twosigma.com/careers/"),
  manual("XTX Markets", "xtx-markets", "https://www.xtxmarkets.com/careers/"),
  manual("Radix Trading LLC", "radix-trading", "https://www.radixtrading.com/careers"),
  manual("GitHub", "github", "https://github.com/about/careers"),
  manual("X", "x", "https://careers.x.com/"),
  manual("Zillow", "zillow", "https://www.zillow.com/careers/"),
  manual("Yelp", "yelp", "https://www.yelp.careers/"),
  manual("Hugging Face", "hugging-face", "https://huggingface.co/jobs"),
  manual("Renaissance", "renaissance", "https://www.rentec.com/Careers.action"),
  manual("Zynga", "zynga", "https://www.zynga.com/careers/"),
  manual("TextQL", "textql", "https://textql.com/careers"),
  manual("Tesla", "tesla", "https://www.tesla.com/careers"),
  manual("Revolut", "revolut", "https://www.revolut.com/careers/"),
  manual("Visa", "visa", "https://usa.visa.com/careers.html"),
  manual("Intuit", "intuit", "https://www.intuit.com/careers/"),
];

export const ALL_CATALOG_COMPANIES: CatalogCompany[] = [
  ...LEGACY_COMPANIES,
  ...GREENHOUSE_COMPANIES,
  ...LEVER_COMPANIES,
  ...ASHBY_COMPANIES,
  ...WORKDAY_COMPANIES,
  ...MANUAL_COMPANIES,
];
