import type { RawJob } from "../types";

const SEARCH_URL =
  "https://www.google.com/about/careers/applications/jobs/results/?q=new%20grad%20software%20engineer&employment_type=FULL_TIME&page_size=100";

export function parseGoogleSearchHtml(html: string): RawJob[] {
  const jobs: RawJob[] = [];
  const matches = html.matchAll(
    /\/jobs\/results\/(\d+)[^"']*"[^>]*>([^<]{5,120})</g,
  );

  for (const match of matches) {
    const [, id, title] = match;
    jobs.push({
      externalId: id,
      title: title.trim(),
      url: `https://www.google.com/about/careers/applications/jobs/results/${id}`,
      locations: [],
    });
  }

  return jobs;
}

export async function fetchGoogleJobs(): Promise<RawJob[]> {
  const response = await fetch(SEARCH_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Google careers page failed: HTTP ${response.status}`);
  }

  const html = await response.text();
  const jobs = parseGoogleSearchHtml(html);

  if (jobs.length === 0) {
    throw new Error(
      "Google careers page returned no parseable jobs. Results may require client-side rendering.",
    );
  }

  return jobs;
}

export function parseGoogleBatchResponse(payload: string) {
  return parseGoogleSearchHtml(payload);
}
