"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionProgress } from "@/components/prep/session-progress";
import { previewGradeIntervals } from "@/lib/prep-intervals";
import type { ReviewGrade } from "@/lib/srs";
import { cn } from "@/lib/utils";

type ReviewCard = {
  id: string;
  slug: string;
  topicSlug: string;
  topic: string;
  front: string;
  back: string;
  reps: number;
  ease: number;
  intervalDays: number;
};

type SessionStats = {
  again: number;
  hard: number;
  good: number;
  easy: number;
};

type PrepReviewSessionProps = {
  topicSlug?: string;
};

const EMPTY_STATS: SessionStats = { again: 0, hard: 0, good: 0, easy: 0 };

const GRADE_OPTIONS: { grade: ReviewGrade; label: string; variant: "outline" | "default" | "secondary" }[] = [
  { grade: "again", label: "Again", variant: "outline" },
  { grade: "hard", label: "Hard", variant: "outline" },
  { grade: "good", label: "Good", variant: "default" },
  { grade: "easy", label: "Easy", variant: "secondary" },
];

export function PrepReviewSession({ topicSlug }: PrepReviewSessionProps) {
  const router = useRouter();
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>(EMPTY_STATS);
  const [complete, setComplete] = useState(false);

  const loadCards = useCallback(async (resetLoading = false) => {
    if (resetLoading) {
      setLoading(true);
    }
    setError(null);
    setComplete(false);
    setSessionStats(EMPTY_STATS);

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
    let active = true;

    async function load() {
      try {
        const params = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
        const response = await fetch(`/api/prep/due${params}`);
        const data = await response.json();

        if (!active) return;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load cards");
        }

        setCards(data.cards);
        setError(null);
        setComplete(false);
        setSessionStats(EMPTY_STATS);
        setIndex(0);
        setFlipped(false);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load cards");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [topicSlug]);

  const gradeCard = useCallback(
    async (grade: ReviewGrade) => {
      const card = cards[index];
      if (!card || grading || complete) return;

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

        setSessionStats((current) => ({
          ...current,
          [grade]: current[grade] + 1,
        }));

        if (index + 1 >= cards.length) {
          setComplete(true);
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
    },
    [cards, complete, grading, index, router],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (loading || complete || grading || cards.length === 0) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (!flipped) {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          setFlipped(true);
        }
        return;
      }

      const gradeByKey: Record<string, ReviewGrade> = {
        "1": "again",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };

      const grade = gradeByKey[event.key];
      if (grade) {
        event.preventDefault();
        void gradeCard(grade);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cards.length, complete, flipped, gradeCard, grading, loading]);

  const currentCard = cards[index];
  const gradeIntervals = useMemo(() => {
    if (!currentCard) return null;
    return previewGradeIntervals({
      reps: currentCard.reps,
      ease: currentCard.ease,
      intervalDays: currentCard.intervalDays,
    });
  }, [currentCard]);

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 py-16">
          <div className="mx-auto h-1 max-w-xs animate-pulse rounded-full bg-black/[0.06]" />
          <p className="text-center text-sm text-[var(--muted)]">Loading cards...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && cards.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <p className="text-sm text-[var(--destructive)]">{error}</p>
          <Button size="sm" onClick={() => void loadCards(true)}>
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

  if (complete) {
    const remembered = sessionStats.good + sessionStats.easy;

    return (
      <Card>
        <CardContent className="space-y-4 py-10 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">Review complete</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-[var(--muted)]">
            <span>{remembered} good/easy</span>
            <span>·</span>
            <span>{sessionStats.hard} hard</span>
            <span>·</span>
            <span>{sessionStats.again} again</span>
          </div>
          <Button asChild>
            <Link href="/prep">Back to Prep</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const card = currentCard!;

  return (
    <div className="space-y-4">
      <SessionProgress current={index} total={cards.length} />

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="group w-full text-left [perspective:1000px]"
      >
        <div
          className={cn(
            "relative min-h-[220px] transition-transform duration-300 [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]",
          )}
        >
          <Card className="absolute inset-0 min-h-[220px] [backface-visibility:hidden]">
            <CardContent className="flex min-h-[220px] flex-col justify-center p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Prompt
              </p>
              <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                {card.front}
              </p>
              <p className="mt-6 text-xs text-[var(--muted)]">
                Tap or press Space to flip
              </p>
            </CardContent>
          </Card>

          <Card className="absolute inset-0 min-h-[220px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <CardContent className="flex min-h-[220px] flex-col justify-center p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Answer
              </p>
              <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                {card.back}
              </p>
              <p className="mt-6 text-xs text-[var(--muted)]">1–4 to grade</p>
            </CardContent>
          </Card>
        </div>
      </button>

      {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}

      {flipped ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GRADE_OPTIONS.map(({ grade, label, variant }) => (
            <Button
              key={grade}
              variant={variant}
              disabled={grading}
              className="flex flex-col gap-0.5 py-2.5 h-auto"
              onClick={() => gradeCard(grade)}
            >
              <span>{label}</span>
              <span className="text-[10px] font-normal opacity-70">
                {gradeIntervals?.[grade]}
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <Button className="w-full" onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      )}
    </div>
  );
}
