import { describe, expect, it } from "vitest";
import fixture from "../../../tests/fixtures/lever-jobs.json";
import { parseLeverJobs } from "./lever";

describe("lever adapter", () => {
  it("parses lever job responses", () => {
    const jobs = parseLeverJobs(fixture);

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      externalId: "abc-123",
      title: "New Grad Software Engineer",
      url: "https://jobs.lever.co/example/abc-123",
      locations: ["New York, NY"],
    });
  });
});
