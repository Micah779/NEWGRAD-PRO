import { desc, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { drillAttempts, drillQuestions } from "@/db/schema";
import type { DrillChoice } from "@/db/schema";
import { addCentralDays, formatCentralDay } from "@/lib/central-time";

const SESSION_SIZE = 10;
const MAX_PER_TOPIC = 2;

export type DrillSessionQuestion = {
  id: string;
  slug: string;
  topicSlug: string;
  topic: string;
  scenario: string;
  choices: DrillChoice[];
  correctChoiceId: string;
  explanation: string;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function scoreQuestion(
  questionId: string,
  attemptsByQuestion: Map<string, { correct: boolean; attemptedAt: Date }[]>,
): number {
  const attempts = attemptsByQuestion.get(questionId) ?? [];
  if (attempts.length === 0) {
    return 100;
  }

  const sorted = [...attempts].sort(
    (a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime(),
  );
  const latest = sorted[0];

  if (!latest.correct) {
    return 85;
  }

  const daysSince =
    (Date.now() - latest.attemptedAt.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(15, 55 - daysSince * 8);
}

export async function buildDrillSession(
  db: Db,
  userEmail: string,
  topicSlug?: string,
): Promise<DrillSessionQuestion[]> {
  const questions = await db.query.drillQuestions.findMany({
    where: topicSlug ? eq(drillQuestions.topicSlug, topicSlug) : undefined,
  });

  if (questions.length === 0) {
    return [];
  }

  const attempts = await db
    .select({
      questionId: drillAttempts.questionId,
      correct: drillAttempts.correct,
      attemptedAt: drillAttempts.attemptedAt,
    })
    .from(drillAttempts)
    .where(eq(drillAttempts.userEmail, userEmail))
    .orderBy(desc(drillAttempts.attemptedAt));

  const attemptsByQuestion = new Map<string, { correct: boolean; attemptedAt: Date }[]>();
  for (const attempt of attempts) {
    const existing = attemptsByQuestion.get(attempt.questionId) ?? [];
    existing.push({ correct: attempt.correct, attemptedAt: attempt.attemptedAt });
    attemptsByQuestion.set(attempt.questionId, existing);
  }

  const scored = questions
    .map((question) => ({
      question,
      score: scoreQuestion(question.id, attemptsByQuestion) + Math.random() * 12,
    }))
    .sort((a, b) => b.score - a.score);

  const selected: typeof questions = [];
  const topicCounts = new Map<string, number>();

  for (const entry of scored) {
    if (selected.length >= SESSION_SIZE) break;

    const topicCount = topicCounts.get(entry.question.topicSlug) ?? 0;
    if (!topicSlug && topicCount >= MAX_PER_TOPIC) {
      continue;
    }

    selected.push(entry.question);
    topicCounts.set(entry.question.topicSlug, topicCount + 1);
  }

  if (selected.length < SESSION_SIZE) {
    for (const entry of scored) {
      if (selected.length >= SESSION_SIZE) break;
      if (selected.some((question) => question.id === entry.question.id)) continue;
      selected.push(entry.question);
    }
  }

  return shuffle(selected).map((question) => ({
    id: question.id,
    slug: question.slug,
    topicSlug: question.topicSlug,
    topic: question.topic,
    scenario: question.scenario,
    choices: shuffle(question.choices),
    correctChoiceId: question.correctChoiceId,
    explanation: question.explanation,
  }));
}

export async function recordDrillAttempt(
  db: Db,
  userEmail: string,
  questionId: string,
  selectedChoiceId: string,
  correct: boolean,
) {
  const [attempt] = await db
    .insert(drillAttempts)
    .values({
      questionId,
      userEmail,
      selectedChoiceId,
      correct,
    })
    .returning();

  return attempt;
}

export async function getTopicDrillAccuracy(
  db: Db,
  userEmail: string,
): Promise<Map<string, { correct: number; total: number }>> {
  const attempts = await db
    .select({
      topicSlug: drillQuestions.topicSlug,
      correct: drillAttempts.correct,
    })
    .from(drillAttempts)
    .innerJoin(drillQuestions, eq(drillAttempts.questionId, drillQuestions.id))
    .where(eq(drillAttempts.userEmail, userEmail));

  const stats = new Map<string, { correct: number; total: number }>();

  for (const attempt of attempts) {
    const current = stats.get(attempt.topicSlug) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (attempt.correct) current.correct += 1;
    stats.set(attempt.topicSlug, current);
  }

  return stats;
}

export function computeActivityStreak(activeDays: Set<string>, now = new Date()): number {
  const today = formatCentralDay(now);
  const yesterday = formatCentralDay(addCentralDays(now, -1));

  let offset = 0;
  if (!activeDays.has(today)) {
    if (!activeDays.has(yesterday)) {
      return 0;
    }
    offset = 1;
  }

  let streak = 0;
  while (activeDays.has(formatCentralDay(addCentralDays(now, -offset)))) {
    streak += 1;
    offset += 1;
  }

  return streak;
}
