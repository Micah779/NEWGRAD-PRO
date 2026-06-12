import { getDataDb } from "@/lib/data";
import { PipelineBoard } from "@/components/applications/pipeline-board";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const db = getDataDb();
  const rows = db
    ? await db.query.applications.findMany({
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Application Pipeline</h2>
        <p className="text-slate-500">
          Track every application from first submit through offer or rejection.
        </p>
      </div>
      <PipelineBoard applications={serialized} />
    </div>
  );
}
