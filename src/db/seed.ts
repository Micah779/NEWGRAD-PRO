import { companies } from "./schema";
import type { Db } from "./index";
import { ALL_CATALOG_COMPANIES } from "./company-catalog";

export { ALL_CATALOG_COMPANIES as SEED_COMPANIES } from "./company-catalog";

export async function seedCompanies(db: Db) {
  for (const company of ALL_CATALOG_COMPANIES) {
    await db
      .insert(companies)
      .values({
        name: company.name,
        slug: company.slug,
        adapterKey: company.adapterKey,
        adapterConfig: company.adapterConfig ?? null,
        careersUrl: company.careersUrl,
        enabled: company.enabled ?? true,
      })
      .onConflictDoNothing({ target: companies.slug });
  }
}
