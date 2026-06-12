import { differenceInDays } from "date-fns";
import type { Application, ApplicationEvent, ApplicationStage } from "@/db/schema";

export const STAGE_ORDER: ApplicationStage[] = [
  "applied",
  "screening",
  "oa",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  applied: "Applied",
  screening: "Screening",
  oa: "Online Assessment",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const PIPELINE_STAGES: ApplicationStage[] = [
  "applied",
  "screening",
  "oa",
  "interview",
  "offer",
  "rejected",
];

type ApplicationWithEvents = Application & {
  events: ApplicationEvent[];
};

export function buildFunnel(applications: ApplicationWithEvents[]) {
  const counts: Record<ApplicationStage, number> = {
    applied: 0,
    screening: 0,
    oa: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  for (const application of applications) {
    counts[application.stage] += 1;
  }

  const reached = (stage: ApplicationStage) => {
    const stageIndex = STAGE_ORDER.indexOf(stage);
    return applications.filter((application) => {
      const currentIndex = STAGE_ORDER.indexOf(application.stage);
      if (application.stage === "rejected" || application.stage === "withdrawn") {
        return application.events.some((event) => {
          const eventIndex = STAGE_ORDER.indexOf(event.toStage);
          return eventIndex >= stageIndex;
        });
      }
      return currentIndex >= stageIndex;
    }).length;
  };

  return [
    { stage: "applied", label: "Applied", count: reached("applied") },
    { stage: "screening", label: "Screening", count: reached("screening") },
    { stage: "oa", label: "OA", count: reached("oa") },
    { stage: "interview", label: "Interview", count: reached("interview") },
    { stage: "offer", label: "Offer", count: reached("offer") },
  ];
}

export function calculateResponseRate(applications: ApplicationWithEvents[]) {
  if (applications.length === 0) return 0;

  const responded = applications.filter((application) =>
    application.events.some((event) => event.toStage !== "applied"),
  ).length;

  return Math.round((responded / applications.length) * 100);
}

export function calculateMedianDaysInStage(applications: ApplicationWithEvents[]) {
  const durations: number[] = [];

  for (const application of applications) {
    const sortedEvents = [...application.events].sort(
      (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime(),
    );

    for (let index = 0; index < sortedEvents.length - 1; index += 1) {
      const current = sortedEvents[index];
      const next = sortedEvents[index + 1];
      durations.push(
        differenceInDays(next.occurredAt, current.occurredAt),
      );
    }
  }

  if (durations.length === 0) return 0;

  durations.sort((a, b) => a - b);
  const middle = Math.floor(durations.length / 2);

  if (durations.length % 2 === 0) {
    return Math.round((durations[middle - 1] + durations[middle]) / 2);
  }

  return durations[middle];
}

export function groupApplicationsByDate(applications: Application[]) {
  const map = new Map<string, number>();

  for (const application of applications) {
    const key = application.appliedAt.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}
