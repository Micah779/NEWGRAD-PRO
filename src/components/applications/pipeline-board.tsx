"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/stats";
import { cn } from "@/lib/utils";
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
  const [mobileStage, setMobileStage] = useState<ApplicationStage>("applied");
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

  const mobileItems = applications.filter((app) => app.stage === mobileStage);

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

      setMobileStage(stage);
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

  function selectApplication(application: ApplicationItem) {
    setSelectedId(application.id);
    setNotes(application.notes ?? "");
    setMobileStage(application.stage);
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm text-[var(--muted)]">No applications yet.</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Mark a job as applied from the Jobs board to start tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Mobile: stage tabs + list */}
      <div className="space-y-3 md:hidden">
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {columns.map((column) => (
            <button
              key={column.stage}
              type="button"
              onClick={() => {
                setMobileStage(column.stage);
                setSelectedId(null);
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                mobileStage === column.stage
                  ? "bg-[var(--foreground)] text-white"
                  : "bg-black/[0.05] text-[var(--muted)]",
              )}
            >
              {column.label}
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px]",
                  mobileStage === column.stage
                    ? "bg-white/20"
                    : "bg-black/[0.06]",
                )}
              >
                {column.items.length}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {mobileItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted)]">
              No applications in this stage.
            </p>
          ) : (
            mobileItems.map((application) => (
              <button
                key={application.id}
                type="button"
                onClick={() => selectApplication(application)}
                className={cn(
                  "w-full rounded-[var(--radius)] border bg-white p-4 text-left transition-colors active:bg-black/[0.02]",
                  selectedId === application.id
                    ? "border-black/20 ring-1 ring-black/10"
                    : "border-black/[0.06]",
                )}
              >
                <p className="text-[15px] font-medium leading-snug text-[var(--foreground)]">
                  {application.snapshotTitle}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {application.snapshotCompany}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Desktop: kanban columns */}
      <div className="hidden gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 lg:grid-cols-6">
        {columns.map((column) => (
          <div key={column.stage} className="min-w-[10rem] space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {column.label}
              </h2>
              <Badge variant="secondary">{column.items.length}</Badge>
            </div>
            <div className="space-y-2">
              {column.items.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => selectApplication(application)}
                  className={cn(
                    "w-full rounded-[var(--radius-sm)] border bg-white p-3 text-left transition-colors hover:bg-black/[0.01]",
                    selectedId === application.id
                      ? "border-black/20 ring-1 ring-black/10"
                      : "border-black/[0.06]",
                  )}
                >
                  <p className="text-sm font-medium leading-snug">
                    {application.snapshotTitle}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {application.snapshotCompany}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected ? (
        <Card>
          <CardHeader>
            <CardTitle>{selected.snapshotTitle}</CardTitle>
            <p className="text-sm text-[var(--muted)]">{selected.snapshotCompany}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {PIPELINE_STAGES.map((stage) => (
                <Button
                  key={stage}
                  size="sm"
                  variant={selected.stage === stage ? "default" : "outline"}
                  disabled={saving}
                  className="shrink-0"
                  onClick={() => updateStage(selected.id, stage)}
                >
                  {STAGE_LABELS[stage]}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Notes
              </label>
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
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Timeline
              </p>
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
                      className="rounded-[var(--radius-sm)] border border-black/[0.06] px-3 py-2.5 text-sm"
                    >
                      <p className="font-medium text-[var(--foreground)]">
                        {event.fromStage
                          ? `${STAGE_LABELS[event.fromStage]} → ${STAGE_LABELS[event.toStage]}`
                          : STAGE_LABELS[event.toStage]}
                      </p>
                      <p className="mt-0.5 text-[var(--muted)]">
                        {new Date(event.occurredAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <a href={selected.snapshotUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open original listing
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="hidden text-center text-sm text-[var(--muted)] md:block">
          Select an application to view details and update its stage.
        </p>
      )}
    </div>
  );
}
