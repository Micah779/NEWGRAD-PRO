import * as cheerio from "cheerio";
import type { RawJob } from "../types";

const SEARCH_URL =
  "https://www.metacareers.com/jobs?q=software%20engineer%20university";

export function parseMetaSearchHtml(html: string): RawJob[] {
  const $ = cheerio.load(html);
  const jobs: RawJob[] = [];

  $("a[href*='/jobs/']").each((_, element) => {
    const href = $(element).attr("href") ?? "";
    const title = $(element).text().trim();
    const match = href.match(/\/jobs\/(\d+)/);

    if (!match || title.length < 5) return;

    jobs.push({
      externalId: match[1],
      title,
      url: href.startsWith("http")
        ? href
        : `https://www.metacareers.com${href}`,
      locations: [],
    });
  });

  return jobs;
}

export async function fetchMetaJobs(): Promise<RawJob[]> {
  const response = await fetch(SEARCH_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Meta careers page failed: HTTP ${response.status}`);
  }

  const html = await response.text();
  const jobs = parseMetaSearchHtml(html);

  if (jobs.length === 0) {
    throw new Error(
      "Meta careers page returned no parseable jobs. Bot protection or page structure may have changed.",
    );
  }

  return jobs;
}

export function parseMetaJobs(data: unknown) {
  void data;
  return [];
}
