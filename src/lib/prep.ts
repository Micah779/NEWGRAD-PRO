import { eq, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { drillAttempts, prepCardProgress, practiceProblemProgress } from "@/db/schema";
import { PREP_TOPICS } from "@/db/prep-catalog";
import { addCentralDays, formatCentralDay, isDueAtOrBefore } from "@/lib/central-time";
import { computeActivityStreak, getTopicDrillAccuracy } from "@/lib/drill";
import { getCardsWithProgress, getProblemsWithProgress } from "@/lib/progress";
import { getTopicPracticeAccuracy } from "@/lib/practice";

const HEATMAP_DAYS = 84;

export async function getPrepDashboardData(db: Db, userEmail: string) {
  const now = new Date();
  const [cards, problems, drillAttemptDates, cardReviewStats, problemCompletionStats, drillCountStats] =
    await Promise.all([
      getCardsWithProgress(db, userEmail),
      getProblemsWithProgress(db, userEmail),
      db
        .select({ attemptedAt: drillAttempts.attemptedAt })
        .from(drillAttempts)
        .where(eq(drillAttempts.userEmail, userEmail)),
      db
        .select({
          total: sql<number>`coalesce(sum(${prepCardProgress.reviewCount}), 0)`,
        })
        .from(prepCardProgress)
        .where(eq(prepCardProgress.userEmail, userEmail)),
      db
        .select({
          total: sql<number>`coalesce(sum(${practiceProblemProgress.completionCount}), 0)`,
        })
        .from(practiceProblemProgress)
        .where(eq(practiceProblemProgress.userEmail, userEmail)),
      db
        .select({ total: sql<number>`count(*)` })
        .from(drillAttempts)
        .where(eq(drillAttempts.userEmail, userEmail)),
    ]);

  const dueCards = cards.filter((card) => isDueAtOrBefore(card.dueAt, now));
  const dueProblems = problems.filter((problem) =>
    isDueAtOrBefore(problem.dueAt, now),
  );
  const drillAccuracy = await getTopicDrillAccuracy(db, userEmail);
  const practiceAccuracy = await getTopicPracticeAccuracy(db, userEmail);

  const activeDays = new Set<string>();
  for (const card of cards) {
    if (card.lastReviewedAt) {
      activeDays.add(formatCentralDay(card.lastReviewedAt));
    }
  }
  for (const problem of problems) {
    if (problem.lastReviewedAt) {
      activeDays.add(formatCentralDay(problem.lastReviewedAt));
    }
  }
  for (const attempt of drillAttemptDates) {
    activeDays.add(formatCentralDay(attempt.attemptedAt));
  }

  const activityHeatmap = Array.from({ length: HEATMAP_DAYS }, (_, index) => {
    const offset = HEATMAP_DAYS - 1 - index;
    const date = formatCentralDay(addCentralDays(now, -offset));
    return {
      date,
      active: activeDays.has(date),
    };
  });

  const topicStats = PREP_TOPICS.map((topic) => {
    const topicCards = cards.filter((card) => card.topicSlug === topic.slug);
    const topicProblems = problems.filter(
      (problem) => problem.topicSlug === topic.slug,
    );
    const due = topicCards.filter((card) => isDueAtOrBefore(card.dueAt, now));
    const practiceDue = topicProblems.filter((problem) =>
      isDueAtOrBefore(problem.dueAt, now),
    );
    const drillStats = drillAccuracy.get(topic.slug);
    const practiceStats = practiceAccuracy.get(topic.slug);

    return {
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      total: topicCards.length,
      due: due.length,
      practiceDue: practiceDue.length,
      drillAccuracy:
        drillStats && drillStats.total > 0
          ? Math.round((drillStats.correct / drillStats.total) * 100)
          : null,
      practiceAccuracy:
        practiceStats && practiceStats.total > 0
          ? Math.round((practiceStats.correct / practiceStats.total) * 100)
          : null,
    };
  });

  return {
    totalCards: cards.length,
    dueCount: dueCards.length,
    practiceDueCount: dueProblems.length,
    streak: computeActivityStreak(activeDays),
    lifetimeStats: {
      cardReviews: Number(cardReviewStats[0]?.total ?? 0),
      problemsCompleted: Number(problemCompletionStats[0]?.total ?? 0),
      drillsAnswered: Number(drillCountStats[0]?.total ?? 0),
      activeDays: activeDays.size,
    },
    activityHeatmap,
    topicStats,
  };
}

export async function getDueCardCount(db: Db, userEmail: string) {
  const cards = await getCardsWithProgress(db, userEmail);
  const now = new Date();
  return cards.filter((card) => isDueAtOrBefore(card.dueAt, now)).length;
}
