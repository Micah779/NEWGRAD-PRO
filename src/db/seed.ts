import { notInArray } from "drizzle-orm";
import { companies, drillQuestions, prepCards } from "./schema";
import type { Db } from "./index";
import { ALL_CATALOG_COMPANIES } from "./company-catalog";
import { PREP_CARDS, PREP_DRILLS, PREP_TOPICS } from "./prep-catalog";

export { ALL_CATALOG_COMPANIES as SEED_COMPANIES } from "./company-catalog";
export { PREP_CARDS, PREP_TOPICS, PREP_DRILLS } from "./prep-catalog";

const topicTitle = (slug: string) =>
  PREP_TOPICS.find((topic) => topic.slug === slug)?.title ?? slug;

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
  const catalogSlugs = PREP_CARDS.map((card) => card.slug);

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

  if (catalogSlugs.length > 0) {
    await db
      .delete(prepCards)
      .where(notInArray(prepCards.slug, catalogSlugs));
  }
}

export async function seedDrillQuestions(db: Db) {
  const catalogSlugs = PREP_DRILLS.map((question) => question.slug);

  for (const question of PREP_DRILLS) {
    await db
      .insert(drillQuestions)
      .values({
        slug: question.slug,
        topicSlug: question.topicSlug,
        topic: topicTitle(question.topicSlug),
        scenario: question.scenario,
        choices: question.choices,
        correctChoiceId: question.correctChoiceId,
        explanation: question.explanation,
      })
      .onConflictDoUpdate({
        target: drillQuestions.slug,
        set: {
          topicSlug: question.topicSlug,
          topic: topicTitle(question.topicSlug),
          scenario: question.scenario,
          choices: question.choices,
          correctChoiceId: question.correctChoiceId,
          explanation: question.explanation,
        },
      });
  }

  if (catalogSlugs.length > 0) {
    await db
      .delete(drillQuestions)
      .where(notInArray(drillQuestions.slug, catalogSlugs));
  }
}
