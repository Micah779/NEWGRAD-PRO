import { describe, expect, it } from "vitest";
import {
  buildFunnel,
  calculateMedianDaysInStage,
  calculateResponseRate,
  groupApplicationsByDate,
} from "./stats";
import type { Application, ApplicationEvent } from "@/db/schema";

function makeApplication(
  overrides: Partial<Application> & { events?: ApplicationEvent[] },
) {
  const { events = [], ...application } = overrides;
  return {
    id: "app-1",
    listingId: "listing-1",
    stage: "applied" as const,
    appliedAt: new Date("2026-01-01"),
    notes: null,
    snapshotTitle: "Software Engineer",
    snapshotUrl: "https://example.com",
    snapshotCompany: "Example",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    events,
    ...application,
  };
}

describe("stats", () => {
  it("builds a funnel from application stages", () => {
    const applications = [
      makeApplication({
        id: "1",
        stage: "interview",
        events: [
          {
            id: "e1",
            applicationId: "1",
            fromStage: null,
            toStage: "applied",
            occurredAt: new Date("2026-01-01"),
          },
          {
            id: "e2",
            applicationId: "1",
            fromStage: "applied",
            toStage: "screening",
            occurredAt: new Date("2026-01-05"),
          },
          {
            id: "e3",
            applicationId: "1",
            fromStage: "screening",
            toStage: "interview",
            occurredAt: new Date("2026-01-10"),
          },
        ],
      }),
    ];

    const funnel = buildFunnel(applications);
    expect(funnel[0].count).toBe(1);
    expect(funnel[3].count).toBe(1);
  });

  it("calculates response rate", () => {
    const applications = [
      makeApplication({
        id: "1",
        events: [
          {
            id: "e1",
            applicationId: "1",
            fromStage: null,
            toStage: "applied",
            occurredAt: new Date(),
          },
        ],
      }),
      makeApplication({
        id: "2",
        events: [
          {
            id: "e2",
            applicationId: "2",
            fromStage: null,
            toStage: "applied",
            occurredAt: new Date(),
          },
          {
            id: "e3",
            applicationId: "2",
            fromStage: "applied",
            toStage: "screening",
            occurredAt: new Date(),
          },
        ],
      }),
    ];

    expect(calculateResponseRate(applications)).toBe(50);
  });

  it("calculates median days in stage", () => {
    const applications = [
      makeApplication({
        events: [
          {
            id: "e1",
            applicationId: "app-1",
            fromStage: null,
            toStage: "applied",
            occurredAt: new Date("2026-01-01"),
          },
          {
            id: "e2",
            applicationId: "app-1",
            fromStage: "applied",
            toStage: "screening",
            occurredAt: new Date("2026-01-06"),
          },
        ],
      }),
    ];

    expect(calculateMedianDaysInStage(applications)).toBe(5);
  });

  it("groups applications by date", () => {
    const grouped = groupApplicationsByDate([
      makeApplication({ appliedAt: new Date("2026-01-01") }),
      makeApplication({ appliedAt: new Date("2026-01-01") }),
      makeApplication({ appliedAt: new Date("2026-01-02") }),
    ]);

    expect(grouped).toEqual([
      { date: "2026-01-01", count: 2 },
      { date: "2026-01-02", count: 1 },
    ]);
  });
});
