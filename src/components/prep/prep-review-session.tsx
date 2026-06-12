"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReviewGrade } from "@/lib/srs";

type ReviewCard = {
  id: string;
  slug: string;
  topicSlug: string;
  topic: string;
  front: string;
  back: string;
};

type PrepReviewSessionProps = {
  topicSlug?: string;
};

export function PrepReviewSession({ topicSlug }: PrepReviewSessionProps) {
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
      const response = await fetch(`/api/prep/due${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load cards");
      }

      setCards(data.cards);
      setIndex(0);
      setFlipped(false);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [topicSlug]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  async function gradeCard(grade: ReviewGrade) {
    const card = cards[index];
    if (!card || grading) return;

    setGrading(true);

    try {
      const response = await fetch("/api/prep/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, grade }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save review");
      }

      if (index + 1 >= cards.length) {
        router.push("/prep");
        router.refresh();
        return;
      }

      setIndex((current) => current + 1);
      setFlipped(false);
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : "Failed to save review",
      );
    } finally {
      setGrading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-[var(--muted)]">
          Loading cards...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <p className="text-sm text-[var(--destructive)]">{error}</p>
          <Button size="sm" onClick={loadCards}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-16 text-center">
          <p className="text-sm text-[var(--muted)]">No cards due right now.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/prep">Back to Prep</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const card = cards[index];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="secondary">
          {index + 1} / {cards.length}
        </Badge>
        <Badge variant="outline">{card.topic}</Badge>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="w-full text-left"
      >
        <Card className="min-h-[220px] transition-colors active:bg-black/[0.01]">
          <CardContent className="flex min-h-[220px] flex-col justify-center p-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              {flipped ? "Answer" : "Prompt"}
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
              {flipped ? card.back : card.front}
            </p>
            <p className="mt-6 text-xs text-[var(--muted)]">Tap to flip</p>
          </CardContent>
        </Card>
      </button>

      {flipped ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            variant="outline"
            disabled={grading}
            onClick={() => gradeCard("again")}
          >
            Again
          </Button>
          <Button
            variant="outline"
            disabled={grading}
            onClick={() => gradeCard("hard")}
          >
            Hard
          </Button>
          <Button disabled={grading} onClick={() => gradeCard("good")}>
            Good
          </Button>
          <Button
            variant="secondary"
            disabled={grading}
            onClick={() => gradeCard("easy")}
          >
            Easy
          </Button>
        </div>
      ) : (
        <Button className="w-full" onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}
