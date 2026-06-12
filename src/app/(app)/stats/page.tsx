import { getDataDb } from "@/lib/data";
import { StatsDashboard } from "@/components/stats/stats-dashboard";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const db = getDataDb();
  const applications = db
    ? await db.query.applications.findMany({
        with: {
          events: true,
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Cycle Statistics</h2>
        <p className="text-slate-500">
          Overall health of your new grad application cycle.
        </p>
      </div>
      <StatsDashboard applications={applications} />
    </div>
  );
}
