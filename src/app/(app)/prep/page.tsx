import { getDataDb } from "@/lib/data";
import { getPrepDashboardData } from "@/lib/prep";
import { requireUserEmail } from "@/lib/session";
import { PrepDashboard } from "@/components/prep/prep-dashboard";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function PrepPage() {
  const userEmail = await requireUserEmail();
  const db = getDataDb();
  const data = db
    ? await getPrepDashboardData(db, userEmail)
    : {
        totalCards: 0,
        dueCount: 0,
        practiceDueCount: 0,
        streak: 0,
        lifetimeStats: {
          cardReviews: 0,
          problemsCompleted: 0,
          drillsAnswered: 0,
          activeDays: 0,
        },
        activityHeatmap: [],
        topicStats: [],
      };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Prep"
        description="Flashcards, problem practice, and pattern drills for daily prep."
      />
      <PrepDashboard {...data} />
    </div>
  );
}
