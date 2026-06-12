import { companies, prepCards } from "./schema";
import type { Db } from "./index";
import { ALL_CATALOG_COMPANIES } from "./company-catalog";
import { PREP_CARDS } from "./prep-catalog";

export { ALL_CATALOG_COMPANIES as SEED_COMPANIES } from "./company-catalog";
export { PREP_CARDS, PREP_TOPICS } from "./prep-catalog";

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

export async function seedPrepCards(db: Db) {
  for (const card of PREP_CARDS) {
    await db
      .insert(prepCards)
      .values({
        slug: card.slug,
        topicSlug: card.topicSlug,
        topic: card.topic,
        front: card.front,
        back: card.back,
      })
      .onConflictDoUpdate({
        target: prepCards.slug,
        set: {
          topicSlug: card.topicSlug,
          topic: card.topic,
          front: card.front,
          back: card.back,
        },
      });
  }
}
