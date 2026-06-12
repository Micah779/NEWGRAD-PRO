"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, BarChart3, KanbanSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Pipeline", icon: KanbanSquare },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/companies", label: "Companies", icon: Building2 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/90 backdrop-blur-xl md:hidden safe-bottom"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[var(--nav-height)] max-w-lg items-stretch justify-around px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-w-[4.5rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-medium transition-colors active:scale-95",
                active
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)]",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  active ? "stroke-[2.25]" : "stroke-[1.75]",
                )}
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
