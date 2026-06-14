import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import {
  prepCardProgress,
  prepCards,
  practiceProblemProgress,
  practiceProblems,
} from "@/db/schema";
import type { SrsState } from "@/lib/srs";

export const DEFAULT_SRS_STATE: SrsState = {
  reps: 0,
  ease: 2.5,
  intervalDays: 0,
};

export type CardWithProgress = {
  id: string;
  slug: string;
  topicSlug: string;
  topic: string;
  front: string;
  back: string;
  reps: number;
  ease: number;
  intervalDays: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
};

export type ProblemWithProgress = {
  id: string;
  slug: string;
  leetcodeNum: number;
  title: string;
  topicSlug: string;
  statement: string;
  implementationCode: string;
  patternChoices: (typeof practiceProblems.$inferSelect)["patternChoices"];
  correctPatternChoiceId: string;
  patternExplanation: string;
  complexityChoices: (typeof practiceProblems.$inferSelect)["complexityChoices"];
  correctComplexityChoiceId: string;
  complexityExplanation: string;
  reps: number;
  ease: number;
  intervalDays: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
};

function mergeCardProgress(
  card: typeof prepCards.$inferSelect,
  progress: typeof prepCardProgress.$inferSelect | undefined,
  now: Date,
): CardWithProgress {
  return {
    id: card.id,
    slug: card.slug,
    topicSlug: card.topicSlug,
    topic: card.topic,
    front: card.front,
    back: card.back,
    reps: progress?.reps ?? DEFAULT_SRS_STATE.reps,
    ease: progress?.ease ?? DEFAULT_SRS_STATE.ease,
    intervalDays: progress?.intervalDays ?? DEFAULT_SRS_STATE.intervalDays,
    dueAt: progress?.dueAt ?? now,
    lastReviewedAt: progress?.lastReviewedAt ?? null,
  };
}

function mergeProblemProgress(
  problem: typeof practiceProblems.$inferSelect,
  progress: typeof practiceProblemProgress.$inferSelect | undefined,
  now: Date,
): ProblemWithProgress {
  return {
    id: problem.id,
    slug: problem.slug,
    leetcodeNum: problem.leetcodeNum,
    title: problem.title,
    topicSlug: problem.topicSlug,
    statement: problem.statement,
    implementationCode: problem.implementationCode,
    patternChoices: problem.patternChoices,
    correctPatternChoiceId: problem.correctPatternChoiceId,
    patternExplanation: problem.patternExplanation,
    complexityChoices: problem.complexityChoices,
    correctComplexityChoiceId: problem.correctComplexityChoiceId,
    complexityExplanation: problem.complexityExplanation,
    reps: progress?.reps ?? DEFAULT_SRS_STATE.reps,
    ease: progress?.ease ?? DEFAULT_SRS_STATE.ease,
    intervalDays: progress?.intervalDays ?? DEFAULT_SRS_STATE.intervalDays,
    dueAt: progress?.dueAt ?? now,
    lastReviewedAt: progress?.lastReviewedAt ?? null,
  };
}

export async function getCardsWithProgress(
  db: Db,
  userEmail: string,
): Promise<CardWithProgress[]> {
  const now = new Date();
  const [cards, progressRows] = await Promise.all([
    db.select().from(prepCards),
    db
      .select()
      .from(prepCardProgress)
      .where(eq(prepCardProgress.userEmail, userEmail)),
  ]);

  const progressByCardId = new Map(progressRows.map((row) => [row.cardId, row]));
  return cards.map((card) =>
    mergeCardProgress(card, progressByCardId.get(card.id), now),
  );
}

export async function getProblemsWithProgress(
  db: Db,
  userEmail: string,
): Promise<ProblemWithProgress[]> {
  const now = new Date();
  const [problems, progressRows] = await Promise.all([
    db.select().from(practiceProblems),
    db
      .select()
      .from(practiceProblemProgress)
      .where(eq(practiceProblemProgress.userEmail, userEmail)),
  ]);

  const progressByProblemId = new Map(
    progressRows.map((row) => [row.problemId, row]),
  );
  return problems.map((problem) =>
    mergeProblemProgress(problem, progressByProblemId.get(problem.id), now),
  );
}

export async function upsertPrepCardProgress(
  db: Db,
  cardId: string,
  userEmail: string,
  next: SrsState & { dueAt: Date; lastReviewedAt: Date },
) {
  const existing = await db.query.prepCardProgress.findFirst({
    where: and(
      eq(prepCardProgress.cardId, cardId),
      eq(prepCardProgress.userEmail, userEmail),
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(prepCardProgress)
      .set({
        reps: next.reps,
        ease: next.ease,
        intervalDays: next.intervalDays,
        dueAt: next.dueAt,
        lastReviewedAt: next.lastReviewedAt,
        reviewCount: existing.reviewCount + 1,
      })
      .where(eq(prepCardProgress.id, existing.id))
      .returning();
    return updated;
  }

  const [inserted] = await db
    .insert(prepCardProgress)
    .values({
      cardId,
      userEmail,
      reps: next.reps,
      ease: next.ease,
      intervalDays: next.intervalDays,
      dueAt: next.dueAt,
      lastReviewedAt: next.lastReviewedAt,
      reviewCount: 1,
    })
    .returning();

  return inserted;
}

export async function upsertPracticeProblemProgress(
  db: Db,
  problemId: string,
  userEmail: string,
  next: SrsState & { dueAt: Date; lastReviewedAt: Date },
) {
  const existing = await db.query.practiceProblemProgress.findFirst({
    where: and(
      eq(practiceProblemProgress.problemId, problemId),
      eq(practiceProblemProgress.userEmail, userEmail),
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(practiceProblemProgress)
      .set({
        reps: next.reps,
        ease: next.ease,
        intervalDays: next.intervalDays,
        dueAt: next.dueAt,
        lastReviewedAt: next.lastReviewedAt,
        completionCount: existing.completionCount + 1,
      })
      .where(eq(practiceProblemProgress.id, existing.id))
      .returning();
    return updated;
  }

  const [inserted] = await db
    .insert(practiceProblemProgress)
    .values({
      problemId,
      userEmail,
      reps: next.reps,
      ease: next.ease,
      intervalDays: next.intervalDays,
      dueAt: next.dueAt,
      lastReviewedAt: next.lastReviewedAt,
      completionCount: 1,
    })
    .returning();

  return inserted;
}
