import { describe, expect, it } from "vitest";
import fixture from "../../../tests/fixtures/workday-jobs.json";
import { buildWorkdayUrl, parseWorkdayJobs } from "./workday";

describe("workday adapter", () => {
  it("parses workday job responses", () => {
    const jobs = parseWorkdayJobs(
      fixture,
      "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite",
    );

    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toBe("Software Engineer - New College Grad");
    expect(jobs[0].url).toContain("Software-Engineer-New-College-Grad");
  });

  it("builds workday API url from config", () => {
    expect(
      buildWorkdayUrl({
        tenant: "nvidia",
        site: "NVIDIAExternalCareerSite",
        wdInstance: "wd5",
      }),
    ).toBe(
      "https://nvidia.wd5.myworkdayjobs.com/wday/cxs/nvidia/NVIDIAExternalCareerSite/jobs",
    );
  });
});
