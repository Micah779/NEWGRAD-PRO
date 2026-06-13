import { NextResponse } from "next/server";
import { getDataDb } from "@/lib/data";
import { getCardsWithProgress } from "@/lib/progress";
import { isDueAtOrBefore } from "@/lib/central-time";
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
  const topicSlug = url.searchParams.get("topic");

  const now = new Date();
  const cards = await getCardsWithProgress(db, userEmail);

  const filtered = cards
    .filter((card) => isDueAtOrBefore(card.dueAt, now))
    .filter((card) => !topicSlug || card.topicSlug === topicSlug)
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());

  return NextResponse.json({
    cards: filtered.map((card) => ({
      id: card.id,
      slug: card.slug,
      topicSlug: card.topicSlug,
      topic: card.topic,
      front: card.front,
      back: card.back,
      reps: card.reps,
      ease: card.ease,
      intervalDays: card.intervalDays,
      dueAt: card.dueAt.toISOString(),
    })),
    totalDue: filtered.length,
  });
}
