import { describe, expect, it } from "vitest";
import type { Company } from "@/db/schema";
import { adapters } from "@/scan/adapters";
import { filterNewGradJobs } from "@/scan/engine";

const runLive = process.env.RUN_LIVE_TESTS === "true";

const REQUIRED_ADAPTERS = new Set(["amazon", "greenhouse", "ashby"]);

const SAMPLE_COMPANIES: Record<string, Partial<Company>> = {
  greenhouse: {
    adapterConfig: { board: "stripe" },
  },
  lever: {
    adapterConfig: { board: "palantir" },
  },
  ashby: {
    adapterConfig: { board: "openai" },
  },
  workday: {
    adapterConfig: {
      tenant: "nvidia",
      site: "NVIDIAExternalCareerSite",
      wdInstance: "wd5",
    },
  },
  manual: {
    slug: "manual-test",
    name: "Manual Test",
    careersUrl: "https://example.com",
  },
};

function mockCompany(adapterKey: string): Company {
  const base = {
    id: "00000000-0000-0000-0000-000000000001",
    slug: adapterKey,
    name: adapterKey,
    adapterKey,
    careersUrl: "https://example.com",
    enabled: true,
    createdAt: new Date(),
    adapterConfig: null,
    ...SAMPLE_COMPANIES[adapterKey],
  };

  return base as Company;
}

describe.runIf(runLive)("live adapter smoke tests", () => {
  for (const adapter of Object.values(adapters)) {
    it(`${adapter.key} returns parseable jobs`, async () => {
      const company = mockCompany(adapter.key);

      try {
        const jobs = await adapter.fetchJobs(company);
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
