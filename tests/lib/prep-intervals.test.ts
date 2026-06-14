import { describe, expect, it } from "vitest";
import { previewGradeIntervals } from "@/lib/prep-intervals";

describe("previewGradeIntervals", () => {
  it("returns interval labels for each grade", () => {
    const intervals = previewGradeIntervals({ reps: 2, ease: 2.5, intervalDays: 3 });

    expect(intervals.again).toBe("<1d");
    expect(intervals.good).toMatch(/\d+d|<1d/);
    expect(intervals.easy).toMatch(/\d+d|<1d/);
  });
});
