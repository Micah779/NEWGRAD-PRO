import { describe, expect, it } from "vitest";
import eightfoldFixture from "../../../tests/fixtures/eightfold-search.json";
import { parseEightfoldJobs } from "./eightfold";

describe("eightfold adapter", () => {
  it("parses eightfold search responses", () => {
    const jobs = parseEightfoldJobs(
      eightfoldFixture,
      "https://careers.microsoft.com/us/en/job",
    );

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      externalId: "12345",
      title: "Software Engineer - Entry Level",
      url: "https://careers.microsoft.com/us/en/job/12345",
      locations: ["Redmond, WA"],
    });
  });
});
