import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildFunnel,
  calculateMedianDaysInStage,
  calculateResponseRate,
  groupApplicationsByDate,
  STAGE_LABELS,
} from "@/lib/stats";
import type { Application, ApplicationEvent, ApplicationStage } from "@/db/schema";

type ApplicationWithEvents = Application & {
  events: ApplicationEvent[];
};

type StatsDashboardProps = {
  applications: ApplicationWithEvents[];
};

export function StatsDashboard({ applications }: StatsDashboardProps) {
  const activeCount = applications.filter(
    (app) => !["rejected", "withdrawn", "offer"].includes(app.stage),
  ).length;
  const offerCount = applications.filter((app) => app.stage === "offer").length;
  const rejectedCount = applications.filter((app) => app.stage === "rejected").length;
  const funnel = buildFunnel(applications);
  const responseRate = calculateResponseRate(applications);
  const medianDays = calculateMedianDaysInStage(applications);
  const timeline = groupApplicationsByDate(applications);
  const maxTimeline = Math.max(...timeline.map((item) => item.count), 1);

  const stageCounts = applications.reduce<Record<ApplicationStage, number>>(
    (acc, app) => {
      acc[app.stage] += 1;
      return acc;
    },
    {
      applied: 0,
      screening: 0,
      oa: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    },
  );

  const metrics = [
    { label: "Total applied", value: applications.length },
    { label: "Active pipeline", value: activeCount },
    { label: "Offers", value: offerCount, accent: true },
    { label: "Response rate", value: `${responseRate}%` },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-semibold tracking-tight sm:text-3xl ${
                  metric.accent ? "text-[var(--success)]" : "text-[var(--foreground)]"
                }`}
              >
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnel.map((step) => {
              const width =
                applications.length === 0
                  ? 0
                  : Math.max((step.count / applications.length) * 100, 6);

              return (
                <div key={step.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{step.label}</span>
                    <span className="font-medium tabular-nums">{step.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
                    <div
                      className="h-full rounded-full bg-[var(--foreground)] transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-black/[0.06] pb-3">
              <span className="text-[var(--muted)]">Rejections</span>
              <span className="font-medium tabular-nums">{rejectedCount}</span>
            </div>
            <div className="flex justify-between border-b border-black/[0.06] pb-3">
              <span className="text-[var(--muted)]">Median days between stages</span>
              <span className="font-medium tabular-nums">{medianDays}</span>
            </div>
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Stage breakdown
              </p>
              {Object.entries(stageCounts).map(([stage, count]) => (
                <div key={stage} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">
                    {STAGE_LABELS[stage as ApplicationStage]}
                  </span>
                  <span className="font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications over time</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted)]">
              No applications yet.
            </p>
          ) : (
            <div className="flex h-40 items-end gap-1.5 sm:h-48 sm:gap-2">
              {timeline.map((item) => (
                <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-[var(--foreground)]"
                    style={{
                      height: `${(item.count / maxTimeline) * 100}%`,
                      minHeight: "8px",
                    }}
                    title={`${item.count} on ${item.date}`}
                  />
                  <span className="w-full truncate text-center text-[9px] text-[var(--muted)] sm:text-[10px]">
                    {item.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
