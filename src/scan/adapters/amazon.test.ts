import { describe, expect, it } from "vitest";
import amazonFixture from "../../../tests/fixtures/amazon-search.json";
import { parseAmazonJobs } from "./amazon";

describe("amazon adapter", () => {
  it("parses amazon search responses", () => {
    const jobs = parseAmazonJobs(amazonFixture);

    expect(jobs).toHaveLength(2);
    expect(jobs[0]).toMatchObject({
      externalId: "3093439",
      title: "Software Dev Engineer I, Amazon University Talent Acquisition",
      url: "https://www.amazon.jobs/en/jobs/3093439/software-dev-engineer-i-amazon-university-talent-acquisition",
      locations: ["Seattle, Washington, USA"],
    });
  });
});
