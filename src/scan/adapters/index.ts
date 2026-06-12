import { fetchAmazonJobs, parseAmazonJobs } from "./amazon";
import { fetchAppleJobs, parseAppleSearchHtml } from "./apple";
import { fetchGoogleJobs, parseGoogleSearchHtml } from "./google";
import { fetchMetaJobs, parseMetaSearchHtml } from "./meta";
import { fetchMicrosoftJobs, parseMicrosoftJobs } from "./microsoft";
import { fetchNetflixJobs, parseNetflixJobs } from "./netflix";
import type { CompanyAdapter } from "../types";

export const adapters: Record<string, CompanyAdapter> = {
  amazon: { key: "amazon", name: "Amazon", fetchJobs: fetchAmazonJobs },
  apple: { key: "apple", name: "Apple", fetchJobs: fetchAppleJobs },
  google: { key: "google", name: "Google", fetchJobs: fetchGoogleJobs },
  meta: { key: "meta", name: "Meta", fetchJobs: fetchMetaJobs },
  microsoft: {
    key: "microsoft",
    name: "Microsoft",
    fetchJobs: fetchMicrosoftJobs,
  },
  netflix: { key: "netflix", name: "Netflix", fetchJobs: fetchNetflixJobs },
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
};
