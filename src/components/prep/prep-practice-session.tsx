"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReviewGrade } from "@/lib/srs";

type PracticeChoice = {
  id: string;
  label: string;
};

type PracticeProblem = {
  id: string;
  statement: string;
};

type ChoiceFeedback = {
  correct: boolean;
  correctChoiceId: string;
  selectedChoiceId: string;
  explanation: string;
};

type Stage1Feedback = ChoiceFeedback & {
  implementationCode: string;
};

type Stage2Feedback = ChoiceFeedback & {
  leetcodeNum: number;
  title: string;
  patternExplanation: string;
  complexityExplanation: string;
  suggestedGrade: ReviewGrade;
};

type PrepPracticeSessionProps = {
  topicSlug?: string;
};

type SessionStep = "pattern" | "complexity" | "grade";

export function PrepPracticeSession({ topicSlug }: PrepPracticeSessionProps) {
  const router = useRouter();
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<SessionStep>("pattern");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [choices, setChoices] = useState<PracticeChoice[]>([]);
  const [implementationCode, setImplementationCode] = useState<string | null>(null);
  const [stage1Feedback, setStage1Feedback] = useState<Stage1Feedback | null>(null);
  const [stage2Feedback, setStage2Feedback] = useState<Stage2Feedback | null>(null);
  const [patternCorrect, setPatternCorrect] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [complete, setComplete] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<ReviewGrade | null>(null);

  const loadProblems = useCallback(async (resetLoading = false) => {
    if (resetLoading) setLoading(true);
    setError(null);
    setComplete(false);
    setSessionStats({ correct: 0, total: 0 });
    setIndex(0);
    resetProblemState();

    try {
      const params = topicSlug ? `?topic=${encodeURIComponent(topicSlug)}` : "";
      const response = await fetch(`/api/prep/practice${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to load problems");
      setProblems(data.problems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [topicSlug]);

  function resetProblemState() {
    setStep("pattern");
    setChoices([]);
    setImplementationCode(null);
    setStage1Feedback(null);
    setStage2Feedback(null);
    setPatternCorrect(false);
    setSelectedGrade(null);
  }

  const loadStageChoices = useCallback(
    async (problemId: string, stage: 1 | 2) => {
      const response = await fetch(
        `/api/prep/practice?problemId=${problemId}&stage=${stage}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to load choices");
      setChoices(data.choices);
      if (stage === 2 && data.implementationCode) {
        setImplementationCode(data.implementationCode);
      }
    },
    [],
  );

  useEffect(() => {
    void loadProblems();
  }, [loadProblems]);

  useEffect(() => {
    if (problems.length === 0 || complete) return;
    const problem = problems[index];
    if (!problem) return;

    let active = true;
    void loadStageChoices(problem.id, 1).catch((loadError) => {
      if (active) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load");
      }
    });

    return () => {
      active = false;
    };
  }, [problems, index, complete, loadStageChoices]);

  async function submitPattern(choiceId: string) {
    const problem = problems[index];
    if (!problem || submitting || stage1Feedback) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/prep/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grade",
          problemId: problem.id,
          stage: 1,
          selectedChoiceId: choiceId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to submit");

      setPatternCorrect(data.correct);
      setImplementationCode(data.implementationCode);
      setStage1Feedback({ ...data, selectedChoiceId: choiceId });
      setStep("complexity");
      await loadStageChoices(problem.id, 2);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitComplexity(choiceId: string) {
    const problem = problems[index];
    if (!problem || submitting || stage2Feedback) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/prep/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grade",
          problemId: problem.id,
          stage: 2,
          selectedChoiceId: choiceId,
          patternCorrect,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to submit");

      const bothCorrect = patternCorrect && data.correct;
      setSessionStats((current) => ({
        correct: current.correct + (bothCorrect ? 1 : 0),
        total: current.total + 1,
      }));
      setStage2Feedback({ ...data, selectedChoiceId: choiceId });
      setSelectedGrade(data.suggestedGrade);
      setStep("grade");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  const finishProblem = useCallback(
    async (grade: ReviewGrade) => {
      const problem = problems[index];
      if (!problem || submitting) return;

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/prep/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "complete",
            problemId: problem.id,
            grade,
          }),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Failed to save");
        }

        if (index + 1 >= problems.length) {
          setComplete(true);
          router.refresh();
          return;
        }

        setIndex((current) => current + 1);
        resetProblemState();
      } catch (finishError) {
        setError(finishError instanceof Error ? finishError.message : "Failed to save");
      } finally {
        setSubmitting(false);
      }
    },
    [index, problems, router, submitting],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (loading || complete || submitting || step !== "grade" || !stage2Feedback) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
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
        void finishProblem(grade);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [complete, finishProblem, loading, stage2Feedback, step, submitting]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-[var(--muted)]">
          Loading problems...
        </CardContent>
      </Card>
    );
  }

  if (error && problems.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <p className="text-sm text-[var(--destructive)]">{error}</p>
          <Button size="sm" onClick={() => void loadProblems(true)}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (problems.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-16 text-center">
          <p className="text-sm text-[var(--muted)]">No problems due right now.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/prep">Back to Prep</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (complete) {
    const accuracy =
      sessionStats.total > 0
        ? Math.round((sessionStats.correct / sessionStats.total) * 100)
        : 0;

    return (
      <Card>
        <CardContent className="space-y-4 py-10 text-center">
          <p className="text-lg font-semibold text-[var(--foreground)]">Practice complete</p>
          <p className="text-sm text-[var(--muted)]">
            {sessionStats.correct} / {sessionStats.total} fully correct ({accuracy}%)
          </p>
          <Button asChild>
            <Link href="/prep">Back to Prep</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const problem = problems[index];
  const stepLabel = step === "pattern" ? "Step 1 of 2" : "Step 2 of 2";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {index + 1} / {problems.length}
        </Badge>
        {step !== "grade" ? (
          <Badge variant="outline">{stepLabel}</Badge>
        ) : null}
      </div>

      {step === "pattern" ? (
        <>
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                What pattern fits?
              </p>
              <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                {problem.statement}
              </p>
            </CardContent>
          </Card>

          <ChoiceList
            choices={choices}
            feedback={stage1Feedback}
            disabled={Boolean(stage1Feedback) || submitting}
            onSelect={(id) => void submitPattern(id)}
          />

          {stage1Feedback ? (
            <FeedbackCard
              correct={stage1Feedback.correct}
              explanation={stage1Feedback.explanation}
            />
          ) : null}
        </>
      ) : null}

      {step === "complexity" || step === "grade" ? (
        <>
          {implementationCode ? (
            <Card>
              <CardContent className="space-y-3 p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  Implementation
                </p>
                <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-black/[0.03] p-4 font-mono text-xs leading-relaxed text-[var(--foreground)]">
                  {implementationCode}
                </pre>
              </CardContent>
            </Card>
          ) : null}

          {step === "complexity" ? (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Time and space complexity?
              </p>
              <ChoiceList
                choices={choices}
                feedback={stage2Feedback}
                disabled={Boolean(stage2Feedback) || submitting}
                onSelect={(id) => void submitComplexity(id)}
              />
            </>
          ) : null}

          {stage2Feedback ? (
            <>
              <Card className="border-[var(--accent)]/30 bg-[var(--accent-soft)]">
                <CardContent className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {stage2Feedback.leetcodeNum}. {stage2Feedback.title}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    <span className="font-medium text-[var(--foreground)]">Pattern: </span>
                    {stage2Feedback.patternExplanation}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    <span className="font-medium text-[var(--foreground)]">Complexity: </span>
                    {stage2Feedback.complexityExplanation}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    ["again", "Again"],
                    ["hard", "Hard"],
                    ["good", "Good"],
                    ["easy", "Easy"],
                  ] as const
                ).map(([grade, label]) => (
                  <Button
                    key={grade}
                    variant={selectedGrade === grade ? "default" : "outline"}
                    disabled={submitting}
                    onClick={() => void finishProblem(grade)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <p className="text-center text-xs text-[var(--muted)]">Press 1–4 to grade</p>
            </>
          ) : null}
        </>
      ) : null}

      {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
    </div>
  );
}

function ChoiceList({
  choices,
  feedback,
  disabled,
  onSelect,
}: {
  choices: PracticeChoice[];
  feedback: ChoiceFeedback | null;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {choices.map((choice) => {
        const isCorrect = feedback?.correctChoiceId === choice.id;
        const isSelectedWrong =
          feedback &&
          feedback.selectedChoiceId === choice.id &&
          !feedback.correct;

        return (
          <button
            key={choice.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(choice.id)}
            className={cn(
              "w-full rounded-[var(--radius-sm)] border px-4 py-3 text-left text-sm transition-colors",
              "border-black/[0.08] bg-white hover:bg-black/[0.02] disabled:cursor-default",
              feedback && isCorrect && "border-[var(--accent)] bg-[var(--accent-soft)]",
              isSelectedWrong &&
                "border-[var(--destructive)] bg-[var(--destructive-bg)]",
            )}
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}

function FeedbackCard({
  correct,
  explanation,
}: {
  correct: boolean;
  explanation: string;
}) {
  return (
    <Card
      className={cn(
        correct
          ? "border-[var(--accent)]/30 bg-[var(--accent-soft)]"
          : "border-[var(--destructive)]/20 bg-[var(--destructive-bg)]",
      )}
    >
      <CardContent className="space-y-2 p-4">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {correct ? "Correct" : "Not quite"}
        </p>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{explanation}</p>
      </CardContent>
    </Card>
  );
}
