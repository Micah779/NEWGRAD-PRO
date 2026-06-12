import { fetchEightfoldJobs } from "./eightfold";

export { parseEightfoldJobs as parseMicrosoftJobs } from "./eightfold";

export async function fetchMicrosoftJobs() {
  return fetchEightfoldJobs({
    careersPageUrl:
      "https://careers.microsoft.com/us/en/search-results?keywords=software%20engineer",
    query: "software engineer",
    baseJobUrl: "https://careers.microsoft.com/us/en/job",
    referer: "https://careers.microsoft.com/",
  });
}
