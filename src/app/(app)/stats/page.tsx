import { eq } from "drizzle-orm";
import { getDataDb } from "@/lib/data";
import { requireUserEmail } from "@/lib/session";
import { applications } from "@/db/schema";
import { StatsDashboard } from "@/components/stats/stats-dashboard";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const userEmail = await requireUserEmail();
  const db = getDataDb();
  const applicationRows = db
    ? await db.query.applications.findMany({
        where: eq(applications.userEmail, userEmail),
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
      <StatsDashboard applications={applicationRows} />
    </div>
  );
}
