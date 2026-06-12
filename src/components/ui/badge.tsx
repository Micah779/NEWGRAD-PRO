import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-black/[0.06] text-[var(--foreground)]",
        secondary: "bg-black/[0.04] text-[var(--muted)]",
        success: "bg-[var(--success-bg)] text-[var(--success)]",
        warning: "bg-[var(--warning-bg)] text-[var(--warning)]",
        destructive: "bg-[var(--destructive-bg)] text-[var(--destructive)]",
        outline: "border border-black/[0.08] text-[var(--muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
