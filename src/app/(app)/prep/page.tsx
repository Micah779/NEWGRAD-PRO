import { getDataDb } from "@/lib/data";
import { getPrepDashboardData } from "@/lib/prep";
import { PrepDashboard } from "@/components/prep/prep-dashboard";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function PrepPage() {
  const db = getDataDb();
  const data = db
    ? await getPrepDashboardData(db)
    : {
        totalCards: 0,
        dueCount: 0,
        streak: 0,
        topicStats: [],
      };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Prep"
        description="Flashcards and drills for pattern recognition."
      />
      <PrepDashboard {...data} />
    </div>
  );
}
