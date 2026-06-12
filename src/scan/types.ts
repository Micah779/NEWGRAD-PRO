export type RawJob = {
  externalId: string;
  title: string;
  url: string;
  locations: string[];
  description?: string;
};

export type CompanyAdapter = {
  key: string;
  name: string;
  fetchJobs: () => Promise<RawJob[]>;
};

export type AdapterFetchResult = {
  adapterKey: string;
  jobs: RawJob[];
  error?: string;
};
