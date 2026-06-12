import { describe, expect, it } from "vitest";
import { formatCentralDay } from "@/lib/central-time";
import { isCardDue, scheduleReview } from "@/lib/srs";

describe("scheduleReview", () => {
  const base = { reps: 0, ease: 2.5, intervalDays: 0 };
  const now = new Date("2026-06-11T12:00:00Z");

  it("resets on again", () => {
    const next = scheduleReview({ reps: 3, ease: 2.5, intervalDays: 10 }, "again", now);
    expect(next.reps).toBe(0);
    expect(next.intervalDays).toBe(0);
    expect(next.ease).toBeLessThan(2.5);
  });

  it("schedules good reviews with growing intervals", () => {
    const first = scheduleReview(base, "good", now);
    expect(first.reps).toBe(1);
    expect(first.intervalDays).toBe(1);
    expect(formatCentralDay(first.dueAt)).toBe("2026-06-12");

    const second = scheduleReview(first, "good", now);
    expect(second.reps).toBe(2);
    expect(second.intervalDays).toBe(3);
    expect(formatCentralDay(second.dueAt)).toBe("2026-06-14");

    const third = scheduleReview(second, "good", now);
    expect(third.intervalDays).toBeGreaterThanOrEqual(3);
  });

  it("schedules again as immediately due", () => {
    const next = scheduleReview(base, "again", now);
    expect(next.intervalDays).toBe(0);
    expect(next.dueAt.getTime()).toBe(now.getTime());
  });

  it("easy gives longer interval than good", () => {
    const good = scheduleReview(base, "good", now);
    const easy = scheduleReview(base, "easy", now);
    expect(easy.intervalDays).toBeGreaterThanOrEqual(good.intervalDays);
  });
});

describe("isCardDue", () => {
  it("returns true when due date is in the past", () => {
    expect(isCardDue(new Date("2026-06-10T12:00:00Z"), new Date("2026-06-11T12:00:00Z"))).toBe(
      true,
    );
  });

  it("returns false when due date is in the future", () => {
    expect(isCardDue(new Date("2026-06-12T12:00:00Z"), new Date("2026-06-11T12:00:00Z"))).toBe(
      false,
    );
  });
});
