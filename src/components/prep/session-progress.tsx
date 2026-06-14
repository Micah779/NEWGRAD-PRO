import { cn } from "@/lib/utils";

type SessionProgressProps = {
  current: number;
  total: number;
  className?: string;
};

export function SessionProgress({ current, total, className }: SessionProgressProps) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span className="font-medium tabular-nums">
          {current} / {total}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
