"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PrepChoiceButton } from "@/components/prep/prep-choice-button";
import { SessionProgress } from "@/components/prep/session-progress";
import { cn } from "@/lib/utils";

type DrillChoice = {
  id: string;
  label: string;
};

type DrillQuestion = {
  id: string;
  slug: string;
  topicSlug: string;
  topic: string;
  scenario: string;
  choices: DrillChoice[];
};

type DrillFeedback = {
  correct: boolean;
  correctChoiceId: string;
  explanation: string;
  selectedChoiceId: string;
};

type PrepDrillSessionProps = {
  topicSlug?: string;
};

export function PrepDrillSession({ topicSlug }: PrepDrillSessionProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<DrillQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<DrillFeedback | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [complete, setComplete] = useState(false);

  const loadSession = useCallback(async (resetLoading = false) => {
    if (resetLoading) {
      setLoading(true);
    }
    setError(null);
    setFeedback(null);
    setComplete(false);
    setSessionStats({ correct: 0, total: 0 });
    setIndex(0);

    try {
      const params = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
      const response = await fetch(`/api/prep/drill${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load drill session");
      }

      setQuestions(data.questions);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load drill");
    } finally {
      setLoading(false);
    }
  }, [topicSlug]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const params = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
        const response = await fetch(`/api/prep/drill${params}`);
        const data = await response.json();

        if (!active) return;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load drill session");
        }

        setQuestions(data.questions);
        setError(null);
        setFeedback(null);
        setComplete(false);
        setSessionStats({ correct: 0, total: 0 });
        setIndex(0);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load drill");
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

  async function submitAnswer(choiceId: string) {
    const question = questions[index];
    if (!question || submitting || feedback) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/prep/drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          selectedChoiceId: choiceId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to submit answer");
      }

      setFeedback({
        correct: data.correct,
        correctChoiceId: data.correctChoiceId,
        explanation: data.explanation,
        selectedChoiceId: choiceId,
      });
      setSessionStats((current) => ({
        correct: current.correct + (data.correct ? 1 : 0),
        total: current.total + 1,
      }));
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to submit answer",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      setComplete(true);
      router.refresh();
      return;
    }

    setIndex((current) => current + 1);
    setFeedback(null);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 py-16">
          <div className="mx-auto h-1 max-w-xs animate-pulse rounded-full bg-black/[0.06]" />
          <p className="text-center text-sm text-[var(--muted)]">Loading drill...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && questions.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <p className="text-sm text-[var(--destructive)]">{error}</p>
          <Button size="sm" onClick={() => void loadSession(true)}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-16 text-center">
          <p className="text-sm text-[var(--muted)]">No drill questions available.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/prep">Back to Prep</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (complete) {
    const accuracy = Math.round((sessionStats.correct / sessionStats.total) * 100);

    return (
      <Card>
        <CardContent className="space-y-4 py-10 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">Drill complete</p>
          <p className="text-sm text-[var(--muted)]">
            {sessionStats.correct} / {sessionStats.total} correct ({accuracy}%)
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={() => void loadSession(true)}>Drill again</Button>
            <Button asChild variant="outline">
              <Link href="/prep">Back to Prep</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[index];

  return (
    <div className="space-y-4">
      <SessionProgress current={index} total={questions.length} />

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            What pattern fits?
          </p>
          <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
            {question.scenario}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {question.choices.map((choice) => {
          const isSelected = feedback?.selectedChoiceId === choice.id;
          const isCorrect = feedback?.correctChoiceId === choice.id;

          return (
            <PrepChoiceButton
              key={choice.id}
              label={choice.label}
              disabled={Boolean(feedback) || submitting}
              correct={Boolean(feedback && isCorrect)}
              incorrect={Boolean(feedback && isSelected && !isCorrect)}
              onClick={() => submitAnswer(choice.id)}
            />
          );
        })}
      </div>

      {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}

      {feedback ? (
        <Card
          className={cn(
            feedback.correct
              ? "border-[var(--accent)]/30 bg-[var(--accent-soft)]"
              : "border-[var(--destructive)]/20 bg-[var(--destructive-bg)]",
          )}
        >
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">
              {feedback.correct ? "Correct" : "Not quite"}
            </p>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {feedback.explanation}
            </p>
            <Button className="w-full" onClick={nextQuestion}>
              {index + 1 >= questions.length ? "Finish" : "Next question"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
