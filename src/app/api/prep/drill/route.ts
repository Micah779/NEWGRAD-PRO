import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { drillQuestions } from "@/db/schema";
import { getDataDb } from "@/lib/data";
import { buildDrillSession, recordDrillAttempt } from "@/lib/drill";
import { getSessionUserEmail } from "@/lib/session";

export async function GET(request: Request) {
  const userEmail = await getSessionUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDataDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const topicSlug = url.searchParams.get("topic") ?? undefined;
  const questions = await buildDrillSession(db, userEmail, topicSlug);

  return NextResponse.json({
    questions: questions.map((question) => ({
      id: question.id,
      slug: question.slug,
      topicSlug: question.topicSlug,
      topic: question.topic,
      scenario: question.scenario,
      choices: question.choices,
    })),
    total: questions.length,
  });
}

const bodySchema = z.object({
  questionId: z.string().uuid(),
  selectedChoiceId: z.string().min(1),
});

export async function POST(request: Request) {
  const userEmail = await getSessionUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDataDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const question = await db.query.drillQuestions.findFirst({
    where: eq(drillQuestions.id, parsed.data.questionId),
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const correct = parsed.data.selectedChoiceId === question.correctChoiceId;
  await recordDrillAttempt(
    db,
    userEmail,
    question.id,
    parsed.data.selectedChoiceId,
    correct,
  );

  return NextResponse.json({
    correct,
    correctChoiceId: question.correctChoiceId,
    explanation: question.explanation,
  });
}
