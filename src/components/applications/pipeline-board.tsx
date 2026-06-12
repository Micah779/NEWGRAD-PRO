"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/stats";
import type { ApplicationStage } from "@/db/schema";

type ApplicationItem = {
  id: string;
  stage: ApplicationStage;
  notes: string | null;
  appliedAt: string;
  snapshotTitle: string;
  snapshotUrl: string;
  snapshotCompany: string;
  events: Array<{
    id: string;
    fromStage: ApplicationStage | null;
    toStage: ApplicationStage;
    occurredAt: string;
  }>;
};

type PipelineBoardProps = {
  applications: ApplicationItem[];
};

export function PipelineBoard({ applications }: PipelineBoardProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = applications.find((app) => app.id === selectedId) ?? null;

  const columns = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => ({
      stage,
      label: STAGE_LABELS[stage],
      items: applications.filter((app) => app.stage === stage),
    }));
  }, [applications]);

  async function updateStage(applicationId: string, stage: ApplicationStage) {
    setSaving(true);

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          notes: selected?.id === applicationId ? notes : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update stage");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update stage");
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes(applicationId: string) {
    const application = applications.find((app) => app.id === applicationId);
    if (!application) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: application.stage,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save notes");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save notes");
    } finally {
      setSaving(false);
    }
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">
          No applications yet. Mark a job as applied from the Jobs board to start tracking.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-6">
        {columns.map((column) => (
          <div key={column.stage} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">{column.label}</h2>
              <Badge variant="secondary">{column.items.length}</Badge>
            </div>
            <div className="space-y-3">
              {column.items.map((application) => (
                <Card
                  key={application.id}
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    selectedId === application.id ? "ring-2 ring-slate-900" : ""
                  }`}
                  onClick={() => {
                    setSelectedId(application.id);
                    setNotes(application.notes ?? "");
                  }}
                >
                  <CardHeader className="space-y-2 p-4">
                    <CardTitle className="text-sm leading-snug">
                      {application.snapshotTitle}
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      {application.snapshotCompany}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected ? (
        <Card>
          <CardHeader>
            <CardTitle>{selected.snapshotTitle}</CardTitle>
            <p className="text-sm text-slate-500">{selected.snapshotCompany}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {PIPELINE_STAGES.map((stage) => (
                <Button
                  key={stage}
                  size="sm"
                  variant={selected.stage === stage ? "default" : "outline"}
                  disabled={saving}
                  onClick={() => updateStage(selected.id, stage)}
                >
                  {STAGE_LABELS[stage]}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Interview prep, recruiter notes, next steps..."
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={saving}
                onClick={() => saveNotes(selected.id)}
              >
                Save notes
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Timeline</p>
              <div className="space-y-2">
                {selected.events
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.occurredAt).getTime() -
                      new Date(b.occurredAt).getTime(),
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <p className="font-medium text-slate-900">
                        {event.fromStage
                          ? `${STAGE_LABELS[event.fromStage]} → ${STAGE_LABELS[event.toStage]}`
                          : STAGE_LABELS[event.toStage]}
                      </p>
                      <p className="text-slate-500">
                        {new Date(event.occurredAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <Button asChild variant="outline" size="sm">
              <a href={selected.snapshotUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open original listing
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
