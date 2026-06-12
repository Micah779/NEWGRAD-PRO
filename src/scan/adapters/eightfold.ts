import * as cheerio from "cheerio";
import { fetchJson } from "../http";
import type { RawJob } from "../types";

type EightfoldSearchResponse = {
  data?: {
    positions?: Array<{
      id: number | string;
      name: string;
      canonicalPositionUrl?: string;
      location?: string;
      locations?: string[];
      department?: string;
    }>;
  };
};

type PcsxConfig = {
  domain: string;
  basePositionFq?: string;
};

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function parseEightfoldJobs(
  data: EightfoldSearchResponse,
  baseUrl: string,
): RawJob[] {
  return (data.data?.positions ?? []).map((position) => ({
    externalId: String(position.id),
    title: position.name,
    url:
      position.canonicalPositionUrl ??
      `${baseUrl.replace(/\/$/, "")}/job/${position.id}`,
    locations: position.locations?.length
      ? position.locations
      : position.location
        ? [position.location]
        : [],
    description: position.department,
  }));
}

export async function loadPcsxConfig(careersPageUrl: string): Promise<PcsxConfig> {
  const response = await fetch(careersPageUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load careers page: HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const pcsxRaw = $("#pcsx-data").html();

  if (!pcsxRaw) {
    throw new Error("PCSX config not found on careers page");
  }

  const pcsxData = JSON.parse(decodeHtmlEntities(pcsxRaw)) as {
    domain: string;
    configs?: {
      pcsxConfig?: {
        searchConfig?: {
          basePositionFq?: string;
        };
      };
    };
  };

  return {
    domain: pcsxData.domain,
    basePositionFq: pcsxData.configs?.pcsxConfig?.searchConfig?.basePositionFq,
  };
}

export async function fetchEightfoldJobs(options: {
  careersPageUrl: string;
  query: string;
  baseJobUrl: string;
  referer: string;
}): Promise<RawJob[]> {
  const config = await loadPcsxConfig(options.careersPageUrl);
  const url = new URL("https://app.eightfold.ai/api/pcsx/search");
  url.searchParams.set("domain", config.domain);
  url.searchParams.set("query", options.query);
  url.searchParams.set("start", "0");
  url.searchParams.set("num", "100");

  if (config.basePositionFq) {
    url.searchParams.set("filterQuery", config.basePositionFq);
  }

  const data = await fetchJson<EightfoldSearchResponse>(url.toString(), {
    headers: {
      Referer: options.referer,
    },
  });

  return parseEightfoldJobs(data, options.baseJobUrl);
}
