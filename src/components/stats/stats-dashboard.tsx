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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Total applied</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{applications.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Active pipeline</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{activeCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Offers</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-emerald-600">
            {offerCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Response rate</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{responseRate}%</CardContent>
        </Card>
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
                  : Math.max((step.count / applications.length) * 100, 8);

              return (
                <div key={step.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{step.label}</span>
                    <span className="font-medium">{step.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-900"
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
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">Rejections:</span>{" "}
              {rejectedCount}
            </p>
            <p>
              <span className="font-medium text-slate-900">Median days between stages:</span>{" "}
              {medianDays}
            </p>
            <div className="space-y-2">
              <p className="font-medium text-slate-900">Current stage breakdown</p>
              {Object.entries(stageCounts).map(([stage, count]) => (
                <div key={stage} className="flex justify-between">
                  <span>{STAGE_LABELS[stage as ApplicationStage]}</span>
                  <span className="font-medium">{count}</span>
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
            <p className="text-sm text-slate-500">No applications yet.</p>
          ) : (
            <div className="flex h-48 items-end gap-2">
              {timeline.map((item) => (
                <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-slate-900"
                    style={{
                      height: `${(item.count / maxTimeline) * 100}%`,
                      minHeight: "12px",
                    }}
                    title={`${item.count} on ${item.date}`}
                  />
                  <span className="text-[10px] text-slate-500">
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
