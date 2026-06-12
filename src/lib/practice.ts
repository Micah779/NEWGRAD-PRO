import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { practiceAttempts, practiceProblems } from "@/db/schema";
import type { DrillChoice } from "@/db/schema";
import { isDueAtOrBefore } from "@/lib/central-time";
import { scheduleReview, type ReviewGrade } from "@/lib/srs";

export type SafePracticeProblem = {
  id: string;
  statement: string;
};

export type PracticeStageFeedback = {
  correct: boolean;
  correctChoiceId: string;
  explanation: string;
  implementationCode?: string;
  leetcodeNum?: number;
  title?: string;
  patternExplanation?: string;
  complexityExplanation?: string;
  suggestedGrade?: ReviewGrade;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function deriveSuggestedGrade(
  patternCorrect: boolean,
  complexityCorrect: boolean,
): ReviewGrade {
  if (patternCorrect && complexityCorrect) return "good";
  if (patternCorrect || complexityCorrect) return "hard";
  return "again";
}

export async function getDuePracticeProblems(
  db: Db,
  topicSlug?: string,
): Promise<SafePracticeProblem[]> {
  const now = new Date();
  const problems = await db.query.practiceProblems.findMany({
    orderBy: (table, { asc }) => [asc(table.dueAt)],
  });

  const filtered = problems
    .filter((problem) => isDueAtOrBefore(problem.dueAt, now))
    .filter((problem) => !topicSlug || problem.topicSlug === topicSlug);

  return filtered.map((problem) => ({
    id: problem.id,
    statement: problem.statement,
  }));
}

export async function getPracticeProblemForStage(
  db: Db,
  problemId: string,
  stage: 1 | 2,
): Promise<{
  choices: DrillChoice[];
  correctChoiceId: string;
} | null> {
  const problem = await db.query.practiceProblems.findFirst({
    where: eq(practiceProblems.id, problemId),
  });

  if (!problem) return null;

  if (stage === 1) {
    return {
      choices: shuffle(problem.patternChoices),
      correctChoiceId: problem.correctPatternChoiceId,
    };
  }

  return {
    choices: shuffle(problem.complexityChoices),
    correctChoiceId: problem.correctComplexityChoiceId,
  };
}

export async function gradePracticeStage(
  db: Db,
  problemId: string,
  stage: 1 | 2,
  selectedChoiceId: string,
  patternCorrect?: boolean,
): Promise<PracticeStageFeedback | null> {
  const problem = await db.query.practiceProblems.findFirst({
    where: eq(practiceProblems.id, problemId),
  });

  if (!problem) return null;

  const correctChoiceId =
    stage === 1
      ? problem.correctPatternChoiceId
      : problem.correctComplexityChoiceId;
  const correct = selectedChoiceId === correctChoiceId;

  await db.insert(practiceAttempts).values({
    problemId,
    stage,
    selectedChoiceId,
    correct,
  });

  if (stage === 1) {
    return {
      correct,
      correctChoiceId,
      explanation: problem.patternExplanation,
      implementationCode: problem.implementationCode,
    };
  }

  const patternWasCorrect = patternCorrect ?? false;

  return {
    correct,
    correctChoiceId,
    explanation: problem.complexityExplanation,
    leetcodeNum: problem.leetcodeNum,
    title: problem.title,
    patternExplanation: problem.patternExplanation,
    complexityExplanation: problem.complexityExplanation,
    suggestedGrade: deriveSuggestedGrade(patternWasCorrect, correct),
  };
}

export async function completePracticeProblem(
  db: Db,
  problemId: string,
  grade: ReviewGrade,
) {
  const problem = await db.query.practiceProblems.findFirst({
    where: eq(practiceProblems.id, problemId),
  });

  if (!problem) return null;

  const now = new Date();
  const next = scheduleReview(
    {
      reps: problem.reps,
      ease: problem.ease,
      intervalDays: problem.intervalDays,
    },
    grade,
    now,
  );

  const [updated] = await db
    .update(practiceProblems)
    .set({
      reps: next.reps,
      ease: next.ease,
      intervalDays: next.intervalDays,
      dueAt: next.dueAt,
      lastReviewedAt: now,
    })
    .where(eq(practiceProblems.id, problemId))
    .returning();

  return updated;
}

export async function getTopicPracticeAccuracy(
  db: Db,
): Promise<Map<string, { correct: number; total: number }>> {
  const attempts = await db
    .select({
      topicSlug: practiceProblems.topicSlug,
      correct: practiceAttempts.correct,
    })
    .from(practiceAttempts)
    .innerJoin(
      practiceProblems,
      eq(practiceAttempts.problemId, practiceProblems.id),
    );

  const stats = new Map<string, { correct: number; total: number }>();

  for (const attempt of attempts) {
    const current = stats.get(attempt.topicSlug) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (attempt.correct) current.correct += 1;
    stats.set(attempt.topicSlug, current);
  }

  return stats;
}
