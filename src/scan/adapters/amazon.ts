import { fetchJson } from "../http";
import type { RawJob } from "../types";

type AmazonSearchResponse = {
  jobs?: Array<{
    id_icims: string;
    title: string;
    job_path: string;
    normalized_location?: string;
    city?: string;
    state?: string;
    country_code?: string;
    description_short?: string;
    description?: string;
    basic_qualifications?: string;
    university_job?: boolean | null;
  }>;
};

const SEARCH_QUERIES = [
  "software engineer university",
  "new graduate software engineer",
  "entry level software engineer",
  "software development engineer I",
];

export function parseAmazonJobs(data: AmazonSearchResponse): RawJob[] {
  return (data.jobs ?? []).map((job) => {
    const locationParts = [job.city, job.state, job.country_code].filter(Boolean);
    const locations = job.normalized_location
      ? [job.normalized_location]
      : locationParts.length > 0
        ? [locationParts.join(", ")]
        : [];

    const description = [
      job.description_short,
      job.basic_qualifications,
      job.university_job ? "university job" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      externalId: job.id_icims,
      title: job.title,
      url: `https://www.amazon.jobs${job.job_path}`,
      locations,
      description,
    };
  });
}

function dedupeJobs(jobs: RawJob[]) {
  const map = new Map<string, RawJob>();
  for (const job of jobs) {
    map.set(job.externalId, job);
  }
  return [...map.values()];
}

export async function fetchAmazonJobs(): Promise<RawJob[]> {
  const allJobs: RawJob[] = [];

  for (const query of SEARCH_QUERIES) {
    const url = `https://www.amazon.jobs/en/search.json?base_query=${encodeURIComponent(query)}&result_limit=100&offset=0`;
    const data = await fetchJson<AmazonSearchResponse>(url);
    allJobs.push(...parseAmazonJobs(data));
  }

  return dedupeJobs(allJobs);
}
