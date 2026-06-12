import { fetchJson } from "../http";
import type { RawJob } from "../types";

type NetflixV2JobsResponse = {
  positions?: Array<{
    id: number | string;
    name: string;
    canonicalPositionUrl?: string;
    location?: string;
    locations?: string[];
    department?: string;
  }>;
  count?: number;
};

export function parseNetflixJobs(data: NetflixV2JobsResponse): RawJob[] {
  return (data.positions ?? []).map((position) => ({
    externalId: String(position.id),
    title: position.name,
    url:
      position.canonicalPositionUrl ??
      `https://explore.jobs.netflix.net/careers/job/${position.id}`,
    locations: position.locations?.length
      ? position.locations
      : position.location
        ? [position.location]
        : [],
    description: position.department,
  }));
}

export async function fetchNetflixJobs(): Promise<RawJob[]> {
  const url =
    "https://explore.jobs.netflix.net/api/apply/v2/jobs?domain=netflix.com&query=software%20engineer&num=100&start=0";
  const data = await fetchJson<NetflixV2JobsResponse>(url, {
    headers: { Referer: "https://explore.jobs.netflix.net/careers" },
  });

  return parseNetflixJobs(data);
}
