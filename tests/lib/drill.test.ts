import { describe, expect, it } from "vitest";
import { computeActivityStreak } from "@/lib/drill";

function dayOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

describe("computeActivityStreak", () => {
  it("returns 0 when there is no recent activity", () => {
    expect(computeActivityStreak(new Set([dayOffset(10)]))).toBe(0);
  });

  it("counts consecutive days including today", () => {
    expect(
      computeActivityStreak(new Set([dayOffset(0), dayOffset(1), dayOffset(2)])),
    ).toBe(3);
  });

  it("allows streak to continue from yesterday when today is empty", () => {
    expect(
      computeActivityStreak(new Set([dayOffset(1), dayOffset(2), dayOffset(3)])),
    ).toBe(3);
  });
});
