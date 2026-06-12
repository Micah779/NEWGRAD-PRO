import { describe, expect, it } from "vitest";
import fixture from "../../../tests/fixtures/ashby-jobs.json";
import { parseAshbyJobs } from "./ashby";

describe("ashby adapter", () => {
  it("parses ashby job responses", () => {
    const jobs = parseAshbyJobs(fixture);

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      externalId: "job-uuid-1",
      title: "Software Engineer - Early Career",
      url: "https://jobs.ashbyhq.com/example/job-uuid-1",
      locations: ["Remote"],
    });
  });
});
