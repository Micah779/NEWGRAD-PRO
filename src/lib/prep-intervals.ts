import { scheduleReview, type ReviewGrade, type SrsState } from "@/lib/srs";

export function formatIntervalLabel(days: number): string {
  if (days <= 0) return "<1d";
  if (days === 1) return "1d";
  return `${days}d`;
}

export function previewGradeIntervals(state: SrsState): Record<ReviewGrade, string> {
  const grades: ReviewGrade[] = ["again", "hard", "good", "easy"];
  return Object.fromEntries(
    grades.map((grade) => [
      grade,
      formatIntervalLabel(scheduleReview(state, grade).intervalDays),
    ]),
  ) as Record<ReviewGrade, string>;
}
