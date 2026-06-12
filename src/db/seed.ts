import { companies } from "./schema";
import type { Db } from "./index";

export const SEED_COMPANIES = [
  {
    name: "Google",
    slug: "google",
    adapterKey: "google",
    careersUrl: "https://careers.google.com/jobs/results/",
  },
  {
    name: "Meta",
    slug: "meta",
    adapterKey: "meta",
    careersUrl: "https://www.metacareers.com/jobs",
  },
  {
    name: "Amazon",
    slug: "amazon",
    adapterKey: "amazon",
    careersUrl: "https://www.amazon.jobs/en/search",
  },
  {
    name: "Apple",
    slug: "apple",
    adapterKey: "apple",
    careersUrl: "https://jobs.apple.com/en-us/search",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    adapterKey: "microsoft",
    careersUrl: "https://careers.microsoft.com/us/en/search-results",
  },
  {
    name: "Netflix",
    slug: "netflix",
    adapterKey: "netflix",
    careersUrl: "https://explore.jobs.netflix.net/careers",
  },
] as const;

export async function seedCompanies(db: Db) {
  for (const company of SEED_COMPANIES) {
    await db
      .insert(companies)
      .values(company)
      .onConflictDoNothing({ target: companies.slug });
  }
}
