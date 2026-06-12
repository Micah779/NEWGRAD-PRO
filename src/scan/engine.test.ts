import { describe, expect, it } from "vitest";
import { filterNewGradJobs } from "./engine";
import type { RawJob } from "./types";

const jobs: RawJob[] = [
  {
    externalId: "1",
    title: "Software Dev Engineer I, Amazon University Talent Acquisition",
    url: "https://example.com/1",
    locations: ["Seattle, WA"],
    description: "university hire",
  },
  {
    externalId: "2",
    title: "Senior Software Engineer",
    url: "https://example.com/2",
    locations: ["Seattle, WA"],
    description: "senior role",
  },
];

describe("scan engine", () => {
  it("filters new grad software jobs", () => {
    const filtered = filterNewGradJobs(jobs);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].externalId).toBe("1");
  });
});
