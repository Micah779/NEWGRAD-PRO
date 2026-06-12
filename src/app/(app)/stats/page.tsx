import { getDataDb } from "@/lib/data";
import { StatsDashboard } from "@/components/stats/stats-dashboard";
import { PageHeader } from "@/components/layout/page-header";

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
    <div className="space-y-5">
      <PageHeader
        title="Stats"
        description="Overall health of your new grad application cycle."
      />
      <StatsDashboard applications={applications} />
    </div>
  );
}
