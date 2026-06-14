import { cn } from "@/lib/utils";

type PracticeStep = "pattern" | "complexity" | "grade";

const STEPS: { key: PracticeStep; label: string }[] = [
  { key: "pattern", label: "Pattern" },
  { key: "complexity", label: "Complexity" },
  { key: "grade", label: "Grade" },
];

type PracticeStepPipelineProps = {
  step: PracticeStep;
};

export function PracticeStepPipeline({ step }: PracticeStepPipelineProps) {
  const stepIndex = STEPS.findIndex((entry) => entry.key === step);

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((entry, index) => {
        const done = index < stepIndex;
        const active = index === stepIndex;

        return (
          <div key={entry.key} className="flex flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  "h-1 w-full rounded-full transition-colors duration-200",
                  done || active ? "bg-[var(--accent)]" : "bg-black/[0.06]",
                  active && "opacity-80",
                )}
              />
              <span
                className={cn(
                  "truncate text-[10px] font-medium uppercase tracking-wide",
                  active
                    ? "text-[var(--foreground)]"
                    : done
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)]",
                )}
              >
                {entry.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
