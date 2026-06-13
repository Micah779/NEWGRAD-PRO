import { NextResponse } from "next/server";
import { z } from "zod";
import { getDataDb } from "@/lib/data";
import {
  completePracticeProblem,
  getDuePracticeProblems,
  getPracticeProblemForStage,
  gradePracticeStage,
} from "@/lib/practice";
import { getSessionUserEmail } from "@/lib/session";

const gradeSchema = z.object({
  action: z.literal("grade"),
  problemId: z.string().uuid(),
  stage: z.union([z.literal(1), z.literal(2)]),
  selectedChoiceId: z.string(),
  patternCorrect: z.boolean().optional(),
});

const completeSchema = z.object({
  action: z.literal("complete"),
  problemId: z.string().uuid(),
  grade: z.enum(["again", "hard", "good", "easy"]),
});

const bodySchema = z.discriminatedUnion("action", [gradeSchema, completeSchema]);

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
  const stageParam = url.searchParams.get("stage");
  const problemId = url.searchParams.get("problemId");

  if (problemId && stageParam) {
    const stage = stageParam === "2" ? 2 : 1;
    const stageData = await getPracticeProblemForStage(
      db,
      problemId,
      stage as 1 | 2,
    );

    if (!stageData) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (stage === 2) {
      const problem = await db.query.practiceProblems.findFirst({
        where: (table, { eq: eqOp }) => eqOp(table.id, problemId),
      });

      if (!problem) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
      }

      return NextResponse.json({
        choices: stageData.choices,
        implementationCode: problem.implementationCode,
      });
    }

    return NextResponse.json({ choices: stageData.choices });
  }

  const problems = await getDuePracticeProblems(db, userEmail, topicSlug);

  return NextResponse.json({
    problems,
    totalDue: problems.length,
  });
}

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

  if (parsed.data.action === "grade") {
    const feedback = await gradePracticeStage(
      db,
      userEmail,
      parsed.data.problemId,
      parsed.data.stage,
      parsed.data.selectedChoiceId,
      parsed.data.patternCorrect,
    );

    if (!feedback) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(feedback);
  }

  const updated = await completePracticeProblem(
    db,
    userEmail,
    parsed.data.problemId,
    parsed.data.grade,
  );

  if (!updated) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json({
    problem: {
      id: updated.id,
      reps: updated.reps,
      dueAt: updated.dueAt.toISOString(),
    },
  });
}
