import { addCentralDays } from "@/lib/central-time";

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export type SrsState = {
  reps: number;
  ease: number;
  intervalDays: number;
};

const MIN_EASE = 1.3;

export function scheduleReview(
  state: SrsState,
  grade: ReviewGrade,
  now = new Date(),
): SrsState & { dueAt: Date } {
  let { reps, ease } = state;
  const { intervalDays } = state;
  let nextInterval = intervalDays;

  if (grade === "again") {
    reps = 0;
    nextInterval = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else if (grade === "hard") {
    reps += 1;
    nextInterval = reps === 1 ? 1 : Math.max(1, Math.round(intervalDays * 1.2));
    ease = Math.max(MIN_EASE, ease - 0.15);
  } else if (grade === "good") {
    reps += 1;
    if (reps === 1) {
      nextInterval = 1;
    } else if (reps === 2) {
      nextInterval = 3;
    } else {
      nextInterval = Math.max(1, Math.round(intervalDays * ease));
    }
  } else {
    reps += 1;
    if (reps === 1) {
      nextInterval = 2;
    } else {
      nextInterval = Math.max(1, Math.round(intervalDays * ease * 1.3));
    }
    ease += 0.15;
  }

  const dueAt =
    nextInterval <= 0 ? now : addCentralDays(now, nextInterval);

  return {
    reps,
    ease,
    intervalDays: nextInterval,
    dueAt,
  };
}

export function isCardDue(dueAt: Date, now = new Date()) {
  return dueAt.getTime() <= now.getTime();
}
