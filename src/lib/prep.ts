import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { drillAttempts } from "@/db/schema";
import { PREP_TOPICS } from "@/db/prep-catalog";
import { formatCentralDay, isDueAtOrBefore } from "@/lib/central-time";
import { computeActivityStreak, getTopicDrillAccuracy } from "@/lib/drill";
import { getCardsWithProgress, getProblemsWithProgress } from "@/lib/progress";
import { getTopicPracticeAccuracy } from "@/lib/practice";

export async function getPrepDashboardData(db: Db, userEmail: string) {
  const now = new Date();
  const [cards, problems, drillAttemptDates] = await Promise.all([
    getCardsWithProgress(db, userEmail),
    getProblemsWithProgress(db, userEmail),
    db
      .select({ attemptedAt: drillAttempts.attemptedAt })
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
    topicStats,
  };
}

export async function getDueCardCount(db: Db, userEmail: string) {
  const cards = await getCardsWithProgress(db, userEmail);
  const now = new Date();
  return cards.filter((card) => isDueAtOrBefore(card.dueAt, now)).length;
}
