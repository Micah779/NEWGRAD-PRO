import { cn } from "@/lib/utils";

type ActivityDay = {
  date: string;
  active: boolean;
};

type PrepActivityHeatmapProps = {
  days: ActivityDay[];
};

export function PrepActivityHeatmap({ days }: PrepActivityHeatmapProps) {
  if (days.length === 0) return null;

  const activeCount = days.filter((day) => day.active).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
          Activity
        </h2>
        <span className="text-xs text-[var(--muted)] tabular-nums">
          {activeCount} / {days.length} days
        </span>
      </div>
      <div className="grid grid-cols-[repeat(12,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(24,minmax(0,1fr))]">
        {days.map((day) => (
          <div
            key={day.date}
            title={day.date}
            className={cn(
              "aspect-square rounded-[3px] transition-colors",
              day.active ? "bg-[var(--accent)]/70" : "bg-black/[0.06]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
