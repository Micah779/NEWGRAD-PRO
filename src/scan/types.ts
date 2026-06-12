import type { Company } from "@/db/schema";

export type RawJob = {
  externalId: string;
  title: string;
  url: string;
  locations: string[];
  description?: string;
};

export type AdapterConfig = {
  board?: string;
  tenant?: string;
  site?: string;
  wdInstance?: string;
};

export type CompanyAdapter = {
  key: string;
  name: string;
  fetchJobs: (company: Company) => Promise<RawJob[]>;
};

export type AdapterFetchResult = {
  adapterKey: string;
  jobs: RawJob[];
  error?: string;
};
