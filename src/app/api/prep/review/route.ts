import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getDataDb } from "@/lib/data";
import { prepCards } from "@/db/schema";
import { scheduleReview, type ReviewGrade } from "@/lib/srs";

const bodySchema = z.object({
  cardId: z.string().uuid(),
  grade: z.enum(["again", "hard", "good", "easy"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
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

  const now = new Date();
  const next = scheduleReview(
    {
      reps: card.reps,
      ease: card.ease,
      intervalDays: card.intervalDays,
    },
    parsed.data.grade as ReviewGrade,
    now,
  );

  const [updated] = await db
    .update(prepCards)
    .set({
      reps: next.reps,
      ease: next.ease,
      intervalDays: next.intervalDays,
      dueAt: next.dueAt,
      lastReviewedAt: now,
    })
    .where(eq(prepCards.id, card.id))
    .returning();

  return NextResponse.json({
    card: {
      id: updated.id,
      reps: updated.reps,
      ease: updated.ease,
      intervalDays: updated.intervalDays,
      dueAt: updated.dueAt.toISOString(),
      lastReviewedAt: updated.lastReviewedAt?.toISOString() ?? null,
    },
  });
}
