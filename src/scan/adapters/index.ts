import type { Company } from "@/db/schema";
import { fetchAmazonJobs, parseAmazonJobs } from "./amazon";
import { fetchAppleJobs, parseAppleSearchHtml } from "./apple";
import { fetchAshbyJobs, parseAshbyJobs } from "./ashby";
import { fetchGoogleJobs, parseGoogleSearchHtml } from "./google";
import { fetchGreenhouseJobs, parseGreenhouseJobs } from "./greenhouse";
import { fetchLeverJobs, parseLeverJobs } from "./lever";
import { fetchManualJobs } from "./manual";
import { fetchMetaJobs, parseMetaSearchHtml } from "./meta";
import { fetchMicrosoftJobs, parseMicrosoftJobs } from "./microsoft";
import { fetchNetflixJobs, parseNetflixJobs } from "./netflix";
import { fetchWorkdayJobs, parseWorkdayJobs } from "./workday";
import type { CompanyAdapter } from "../types";

function wrapLegacy(fetcher: () => Promise<ReturnType<CompanyAdapter["fetchJobs"]> extends Promise<infer T> ? T : never>) {
  return (_company: Company) => fetcher();
}

export const adapters: Record<string, CompanyAdapter> = {
  amazon: { key: "amazon", name: "Amazon", fetchJobs: wrapLegacy(fetchAmazonJobs) },
  apple: { key: "apple", name: "Apple", fetchJobs: wrapLegacy(fetchAppleJobs) },
  google: { key: "google", name: "Google", fetchJobs: wrapLegacy(fetchGoogleJobs) },
  meta: { key: "meta", name: "Meta", fetchJobs: wrapLegacy(fetchMetaJobs) },
  microsoft: {
    key: "microsoft",
    name: "Microsoft",
    fetchJobs: wrapLegacy(fetchMicrosoftJobs),
  },
  netflix: { key: "netflix", name: "Netflix", fetchJobs: wrapLegacy(fetchNetflixJobs) },
  greenhouse: {
    key: "greenhouse",
    name: "Greenhouse",
    fetchJobs: (company) =>
      fetchGreenhouseJobs(company.adapterConfig ?? {}),
  },
  lever: {
    key: "lever",
    name: "Lever",
    fetchJobs: (company) => fetchLeverJobs(company.adapterConfig ?? {}),
  },
  ashby: {
    key: "ashby",
    name: "Ashby",
    fetchJobs: (company) => fetchAshbyJobs(company.adapterConfig ?? {}),
  },
  workday: {
    key: "workday",
    name: "Workday",
    fetchJobs: (company) => fetchWorkdayJobs(company.adapterConfig ?? {}),
  },
  manual: {
    key: "manual",
    name: "Manual",
    fetchJobs: fetchManualJobs,
  },
};

export function getAdapter(adapterKey: string) {
  return adapters[adapterKey];
}

export {
  parseAmazonJobs,
  fetchAmazonJobs,
  parseGoogleSearchHtml,
  fetchGoogleJobs,
  parseMicrosoftJobs,
  fetchMicrosoftJobs,
  parseAppleSearchHtml,
  fetchAppleJobs,
  parseNetflixJobs,
  fetchNetflixJobs,
  parseMetaSearchHtml,
  fetchMetaJobs,
  parseGreenhouseJobs,
  fetchGreenhouseJobs,
  parseLeverJobs,
  fetchLeverJobs,
  parseAshbyJobs,
  fetchAshbyJobs,
  parseWorkdayJobs,
  fetchWorkdayJobs,
};
