import { eq } from "drizzle-orm";
import { getDataDb } from "@/lib/data";
import { requireUserEmail } from "@/lib/session";
import { applications } from "@/db/schema";
import { PipelineBoard } from "@/components/applications/pipeline-board";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const userEmail = await requireUserEmail();
  const db = getDataDb();
  const rows = db
    ? await db.query.applications.findMany({
        where: eq(applications.userEmail, userEmail),
        with: {
          events: true,
        },
        orderBy: (table, { desc }) => [desc(table.appliedAt)],
      })
    : [];

  const serialized = rows.map((application) => ({
    id: application.id,
    stage: application.stage,
    notes: application.notes,
    appliedAt: application.appliedAt.toISOString(),
    snapshotTitle: application.snapshotTitle,
    snapshotUrl: application.snapshotUrl,
    snapshotCompany: application.snapshotCompany,
    events: application.events.map((event) => ({
      id: event.id,
      fromStage: event.fromStage,
      toStage: event.toStage,
      occurredAt: event.occurredAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pipeline"
        description="Track every application from first submit through offer or rejection."
      />
      <PipelineBoard applications={serialized} />
    </div>
  );
}
