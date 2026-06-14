"use client";

import { cn } from "@/lib/utils";

type PrepChoiceButtonProps = {
  label: string;
  disabled?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  onClick: () => void;
};

export function PrepChoiceButton({
  label,
  disabled,
  correct,
  incorrect,
  onClick,
}: PrepChoiceButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-[var(--radius-sm)] border px-4 py-3 text-left text-sm transition-all duration-150",
        "border-black/[0.08] bg-white hover:bg-black/[0.02] active:scale-[0.99]",
        "disabled:cursor-default disabled:active:scale-100",
        correct && "border-[var(--accent)] bg-[var(--accent-soft)]",
        incorrect && "border-[var(--destructive)] bg-[var(--destructive-bg)]",
      )}
    >
      {label}
    </button>
  );
}
