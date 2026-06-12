import { describe, expect, it } from "vitest";
import fixture from "../../../tests/fixtures/greenhouse-jobs.json";
import { parseGreenhouseJobs } from "./greenhouse";

describe("greenhouse adapter", () => {
  it("parses greenhouse job responses", () => {
    const jobs = parseGreenhouseJobs(fixture);

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      externalId: "123456",
      title: "Software Engineer, New Grad 2026",
      url: "https://boards.greenhouse.io/example/jobs/123456",
      locations: ["San Francisco, CA"],
    });
  });
});
