import { fetchJsonPost } from "../http";
import type { AdapterConfig } from "../types";
import type { RawJob } from "../types";

type WorkdayJob = {
  title: string;
  externalPath: string;
  bulletFields?: string[];
  locationsText?: string;
  postedOn?: string;
};

type WorkdayResponse = {
  jobPostings?: WorkdayJob[];
  total?: number;
};

export function parseWorkdayJobs(
  data: WorkdayResponse,
  baseUrl: string,
): RawJob[] {
  return (data.jobPostings ?? []).map((job) => {
    const path = job.externalPath.startsWith("/")
      ? job.externalPath
      : `/${job.externalPath}`;

    return {
      externalId: path,
      title: job.title,
      url: `${baseUrl.replace(/\/$/, "")}${path}`,
      locations: job.locationsText ? [job.locationsText] : [],
      description: (job.bulletFields ?? []).join(" "),
    };
  });
}

export function buildWorkdayUrl(config: AdapterConfig): string {
  const { tenant, site, wdInstance = "wd5" } = config;
  if (!tenant || !site) {
    throw new Error("Workday adapter requires adapterConfig.tenant and site");
  }
  return `https://${tenant}.${wdInstance}.myworkdayjobs.com/wday/cxs/${tenant}/${site}/jobs`;
}

export async function fetchWorkdayJobs(config: AdapterConfig): Promise<RawJob[]> {
  const url = buildWorkdayUrl(config);
  const baseUrl = url.replace(/\/wday\/cxs\/.*$/, "");

  const data = await fetchJsonPost<WorkdayResponse>(url, {
    appliedFacets: {},
    limit: 20,
    offset: 0,
    searchText: "software engineer",
  });

  return parseWorkdayJobs(data, baseUrl);
}
