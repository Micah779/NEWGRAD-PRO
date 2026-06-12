import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[var(--foreground)] text-white hover:bg-black/85",
        secondary: "bg-black/[0.05] text-[var(--foreground)] hover:bg-black/[0.08]",
        outline: "border border-black/[0.08] bg-white hover:bg-black/[0.02]",
        ghost: "hover:bg-black/[0.04] text-[var(--foreground)]",
        destructive: "bg-[var(--destructive)] text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 min-h-[44px] px-4 py-2",
        sm: "h-9 min-h-[36px] rounded-md px-3 text-xs",
        lg: "h-12 min-h-[48px] rounded-[var(--radius-sm)] px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
