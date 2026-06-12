import { fetchJson } from "../http";
import type { AdapterConfig } from "../types";
import type { RawJob } from "../types";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name: string };
  content?: string;
  departments?: Array<{ name: string }>;
};

type GreenhouseResponse = {
  jobs?: GreenhouseJob[];
};

export function parseGreenhouseJobs(data: GreenhouseResponse): RawJob[] {
  return (data.jobs ?? []).map((job) => ({
    externalId: String(job.id),
    title: job.title,
    url: job.absolute_url,
    locations: job.location?.name ? [job.location.name] : [],
    description: [job.content, ...(job.departments ?? []).map((d) => d.name)]
      .filter(Boolean)
      .join(" "),
  }));
}

export async function fetchGreenhouseJobs(
  config: AdapterConfig,
): Promise<RawJob[]> {
  const board = config.board;
  if (!board) {
    throw new Error("Greenhouse adapter requires adapterConfig.board");
  }

  const url = `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`;
  const data = await fetchJson<GreenhouseResponse>(url);
  return parseGreenhouseJobs(data);
}
