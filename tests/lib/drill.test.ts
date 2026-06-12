import { describe, expect, it } from "vitest";
import { addCentralDays, formatCentralDay } from "@/lib/central-time";
import { computeActivityStreak } from "@/lib/drill";

function dayOffset(offset: number): string {
  return formatCentralDay(addCentralDays(new Date(), -offset));
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
