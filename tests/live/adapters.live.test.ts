import { describe, expect, it } from "vitest";
import { adapters } from "@/scan/adapters";
import { filterNewGradJobs } from "@/scan/engine";

const runLive = process.env.RUN_LIVE_TESTS === "true";
const REQUIRED_ADAPTERS = new Set(["amazon"]);

describe.runIf(runLive)("live adapter smoke tests", () => {
  for (const adapter of Object.values(adapters)) {
    it(`${adapter.key} returns parseable jobs`, async () => {
      try {
        const jobs = await adapter.fetchJobs();
        expect(Array.isArray(jobs)).toBe(true);

        if (jobs.length > 0) {
          expect(jobs[0].externalId).toBeTruthy();
          expect(jobs[0].title).toBeTruthy();
          expect(jobs[0].url).toMatch(/^https?:\/\//);
        }

        const newGradJobs = filterNewGradJobs(jobs);
        console.log(
          `${adapter.key}: ${jobs.length} total, ${newGradJobs.length} new-grad`,
        );

        if (REQUIRED_ADAPTERS.has(adapter.key)) {
          expect(jobs.length).toBeGreaterThan(0);
        }
      } catch (error) {
        if (REQUIRED_ADAPTERS.has(adapter.key)) {
          throw error;
        }

        console.warn(
          `${adapter.key} live fetch failed:`,
          error instanceof Error ? error.message : error,
        );
      }
    }, 30_000);
  }
});
