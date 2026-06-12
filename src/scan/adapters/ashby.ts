import { fetchJson } from "../http";
import type { AdapterConfig } from "../types";
import type { RawJob } from "../types";

type AshbyJob = {
  id: string;
  title: string;
  jobUrl: string;
  location?: string;
  department?: string;
  descriptionPlain?: string;
};

type AshbyResponse = {
  jobs?: AshbyJob[];
};

export function parseAshbyJobs(data: AshbyResponse): RawJob[] {
  return (data.jobs ?? []).map((job) => ({
    externalId: job.id,
    title: job.title,
    url: job.jobUrl,
    locations: job.location ? [job.location] : [],
    description: [job.descriptionPlain, job.department].filter(Boolean).join(" "),
  }));
}

export async function fetchAshbyJobs(config: AdapterConfig): Promise<RawJob[]> {
  const board = config.board;
  if (!board) {
    throw new Error("Ashby adapter requires adapterConfig.board");
  }

  const url = `https://api.ashbyhq.com/posting-api/job-board/${board}`;
  const data = await fetchJson<AshbyResponse>(url);
  return parseAshbyJobs(data);
}
