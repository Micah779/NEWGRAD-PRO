import { describe, expect, it } from "vitest";
import {
  addCentralDays,
  centralMidnight,
  formatCentralDay,
  nextCentralMidnight,
} from "@/lib/central-time";

describe("formatCentralDay", () => {
  it("formats dates in America/Chicago", () => {
    // 2026-06-12 04:30 UTC = 2026-06-11 23:30 CDT
    expect(formatCentralDay(new Date("2026-06-12T04:30:00Z"))).toBe("2026-06-11");
    // 2026-06-12 06:00 UTC = 2026-06-12 01:00 CDT
    expect(formatCentralDay(new Date("2026-06-12T06:00:00Z"))).toBe("2026-06-12");
  });
});

describe("centralMidnight", () => {
  it("returns midnight Central for a calendar day", () => {
    const midnight = centralMidnight(2026, 6, 12);
    expect(formatCentralDay(midnight)).toBe("2026-06-12");
    expect(midnight.getTime()).toBeLessThan(new Date("2026-06-12T06:00:00Z").getTime());
  });
});

describe("addCentralDays", () => {
  it("schedules due dates at future midnights Central", () => {
    const reviewed = new Date("2026-06-11T20:00:00Z"); // 3pm CDT on June 11
    const due = addCentralDays(reviewed, 1);
    expect(formatCentralDay(due)).toBe("2026-06-12");
    expect(due.getTime()).toBeGreaterThan(reviewed.getTime());
  });
});

describe("nextCentralMidnight", () => {
  it("is the start of the next Central calendar day", () => {
    const now = new Date("2026-06-11T20:00:00Z");
    const next = nextCentralMidnight(now);
    expect(formatCentralDay(next)).toBe("2026-06-12");
  });
});
