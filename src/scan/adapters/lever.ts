import { fetchJson } from "../http";
import type { AdapterConfig } from "../types";
import type { RawJob } from "../types";

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  categories?: {
    location?: string;
    team?: string;
    commitment?: string;
  };
  descriptionPlain?: string;
};

export function parseLeverJobs(data: LeverPosting[]): RawJob[] {
  return data.map((job) => ({
    externalId: job.id,
    title: job.text,
    url: job.hostedUrl,
    locations: job.categories?.location ? [job.categories.location] : [],
    description: [job.descriptionPlain, job.categories?.team, job.categories?.commitment]
      .filter(Boolean)
      .join(" "),
  }));
}

export async function fetchLeverJobs(config: AdapterConfig): Promise<RawJob[]> {
  const board = config.board;
  if (!board) {
    throw new Error("Lever adapter requires adapterConfig.board");
  }

  const url = `https://api.lever.co/v0/postings/${board}?mode=json`;
  const data = await fetchJson<LeverPosting[]>(url);
  return parseLeverJobs(Array.isArray(data) ? data : []);
}
