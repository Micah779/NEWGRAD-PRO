import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { prepCards } from "@/db/schema";
import { getDataDb } from "@/lib/data";
import { getCardsWithProgress, upsertPrepCardProgress } from "@/lib/progress";
import { getSessionUserEmail } from "@/lib/session";
import { scheduleReview, type ReviewGrade } from "@/lib/srs";

const bodySchema = z.object({
  cardId: z.string().uuid(),
  grade: z.enum(["again", "hard", "good", "easy"]),
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

  const card = await db.query.prepCards.findFirst({
    where: eq(prepCards.id, parsed.data.cardId),
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const cardsWithProgress = await getCardsWithProgress(db, userEmail);
  const current = cardsWithProgress.find((entry) => entry.id === card.id);

  if (!current) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const now = new Date();
  const next = scheduleReview(
    {
      reps: current.reps,
      ease: current.ease,
      intervalDays: current.intervalDays,
    },
    parsed.data.grade as ReviewGrade,
    now,
  );

  const updated = await upsertPrepCardProgress(db, card.id, userEmail, {
    ...next,
    lastReviewedAt: now,
  });

  return NextResponse.json({
    card: {
      id: card.id,
      reps: updated.reps,
      ease: updated.ease,
      intervalDays: updated.intervalDays,
      dueAt: updated.dueAt.toISOString(),
      lastReviewedAt: updated.lastReviewedAt?.toISOString() ?? null,
    },
  });
}
