import * as cheerio from "cheerio";
import type { RawJob } from "../types";

const SEARCH_URL =
  "https://jobs.apple.com/en-us/search?search=software%20engineer%20university";

export function parseAppleSearchHtml(html: string): RawJob[] {
  const $ = cheerio.load(html);
  const jobs: RawJob[] = [];

  $("a[href*='/details/']").each((_, element) => {
    const href = $(element).attr("href") ?? "";
    const title = $(element).text().trim();
    const match = href.match(/\/details\/([^/?#]+)/);

    if (!match || title.length < 5) return;

    jobs.push({
      externalId: match[1],
      title,
      url: href.startsWith("http")
        ? href
        : `https://jobs.apple.com${href}`,
      locations: [],
    });
  });

  return jobs;
}

export async function fetchAppleJobs(): Promise<RawJob[]> {
  const response = await fetch(SEARCH_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Apple careers page failed: HTTP ${response.status}`);
  }

  const html = await response.text();
  const jobs = parseAppleSearchHtml(html);

  if (jobs.length === 0) {
    throw new Error(
      "Apple careers page returned no parseable jobs. The page may require client-side rendering.",
    );
  }

  return jobs;
}

