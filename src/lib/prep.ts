import { lte, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { drillAttempts, prepCards } from "@/db/schema";
import { PREP_TOPICS } from "@/db/prep-catalog";
import { computeActivityStreak, getTopicDrillAccuracy } from "@/lib/drill";

function formatDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getPrepDashboardData(db: Db) {
  const now = new Date();
  const [cards, drillAttemptDates] = await Promise.all([
    db.select().from(prepCards),
    db.select({ attemptedAt: drillAttempts.attemptedAt }).from(drillAttempts),
  ]);

  const dueCards = cards.filter((card) => card.dueAt.getTime() <= now.getTime());
  const drillAccuracy = await getTopicDrillAccuracy(db);

  const activeDays = new Set<string>();
  for (const card of cards) {
    if (card.lastReviewedAt) {
      activeDays.add(formatDay(card.lastReviewedAt));
    }
  }
  for (const attempt of drillAttemptDates) {
    activeDays.add(formatDay(attempt.attemptedAt));
  }

  const topicStats = PREP_TOPICS.map((topic) => {
    const topicCards = cards.filter((card) => card.topicSlug === topic.slug);
    const due = topicCards.filter((card) => card.dueAt.getTime() <= now.getTime());
    const drillStats = drillAccuracy.get(topic.slug);

    return {
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      total: topicCards.length,
      due: due.length,
      drillAccuracy:
        drillStats && drillStats.total > 0
          ? Math.round((drillStats.correct / drillStats.total) * 100)
          : null,
    };
  });

  return {
    totalCards: cards.length,
    dueCount: dueCards.length,
    streak: computeActivityStreak(activeDays),
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
