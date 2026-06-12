import { describe, expect, it } from "vitest";
import netflixFixture from "../../../tests/fixtures/netflix-v2-jobs.json";
import { parseNetflixJobs } from "./netflix";

describe("netflix adapter", () => {
  it("parses netflix v2 jobs responses", () => {
    const jobs = parseNetflixJobs(netflixFixture);

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      externalId: "790316292023",
      title: "Software Engineer - New Grad 2026",
      url: "https://explore.jobs.netflix.net/careers/job/790316292023",
      locations: ["USA - Remote"],
    });
  });
});
