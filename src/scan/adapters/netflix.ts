import { fetchEightfoldJobs } from "./eightfold";

export { parseEightfoldJobs as parseNetflixJobs } from "./eightfold";

export async function fetchNetflixJobs() {
  return fetchEightfoldJobs({
    careersPageUrl:
      "https://explore.jobs.netflix.net/careers?query=software%20engineer",
    query: "software engineer",
    baseJobUrl: "https://explore.jobs.netflix.net/careers/job",
    referer: "https://explore.jobs.netflix.net/",
  });
}
