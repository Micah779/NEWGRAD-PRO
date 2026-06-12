"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building2, BarChart3, KanbanSquare, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Pipeline", icon: KanbanSquare },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/prep", label: "Prep", icon: GraduationCap },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-black/[0.04] hover:text-[var(--foreground)]",
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
