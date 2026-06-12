import { lte, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { prepCards } from "@/db/schema";
import { PREP_TOPICS } from "@/db/prep-catalog";

export async function getPrepDashboardData(db: Db) {
  const now = new Date();
  const cards = await db.select().from(prepCards);

  const dueCards = cards.filter((card) => card.dueAt.getTime() <= now.getTime());

  const topicStats = PREP_TOPICS.map((topic) => {
    const topicCards = cards.filter((card) => card.topicSlug === topic.slug);
    const due = topicCards.filter((card) => card.dueAt.getTime() <= now.getTime());
    const reviewed = topicCards.filter((card) => card.reps > 0).length;

    return {
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      total: topicCards.length,
      due: due.length,
      reviewed,
    };
  });

  return {
    totalCards: cards.length,
    dueCount: dueCards.length,
    reviewedCount: cards.filter((card) => card.reps > 0).length,
    topicStats,
  };
}

export async function getDueCardCount(db: Db) {
  const now = new Date();
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(prepCards)
    .where(lte(prepCards.dueAt, now));

  return Number(result[0]?.count ?? 0);
}
