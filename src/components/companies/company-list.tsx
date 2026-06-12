"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";
import type { ScanCompanyResult } from "@/db/schema";

type CompanyItem = {
  id: string;
  name: string;
  slug: string;
  careersUrl: string;
  enabled: boolean;
  lastScan: ScanCompanyResult | null;
  lastScannedAt: string | null;
};

type CompanyListProps = {
  companies: CompanyItem[];
};

export function CompanyList({ companies }: CompanyListProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");

  const filtered = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        search.trim() === "" ||
        company.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "enabled" && company.enabled) ||
        (filter === "disabled" && !company.enabled);
      return matchesSearch && matchesFilter;
    });
  }, [companies, search, filter]);

  async function toggleCompany(company: CompanyItem) {
    setUpdatingId(company.id);

    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !company.enabled }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update company");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update company");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            className="pl-10"
            placeholder="Search companies..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {(["all", "enabled", "disabled"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium capitalize transition-colors ${
                filter === option
                  ? "bg-[var(--foreground)] text-white"
                  : "bg-black/[0.05] text-[var(--muted)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--muted)]">
        {filtered.length} of {companies.length} companies
      </p>

      <div className="divide-y divide-black/[0.06] overflow-hidden rounded-[var(--radius)] border border-black/[0.06] bg-white">
        {filtered.map((company) => (
          <article key={company.id} className="p-4">
            <div className="space-y-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[15px] font-medium text-[var(--foreground)]">
                    {company.name}
                  </h3>
                  <Badge variant={company.enabled ? "default" : "secondary"}>
                    {company.enabled ? "On" : "Off"}
                  </Badge>
                </div>
                <a
                  href={company.careersUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-sm text-[var(--muted)] underline-offset-2 hover:underline"
                >
                  {company.careersUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {company.lastScan ? (
                  <Badge variant={company.lastScan.success ? "success" : "destructive"}>
                    {company.lastScan.success
                      ? `${company.lastScan.newGradJobs} roles`
                      : "Failed"}
                  </Badge>
                ) : (
                  <Badge variant="outline">No data</Badge>
                )}
                <span className="text-xs text-[var(--muted)]">
                  {company.lastScannedAt
                    ? formatRelativeTime(new Date(company.lastScannedAt))
                    : "Not scanned"}
                </span>
              </div>

              {company.lastScan?.error ? (
                <p className="text-xs text-[var(--destructive)]">{company.lastScan.error}</p>
              ) : null}

              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={updatingId === company.id}
                onClick={() => toggleCompany(company)}
              >
                {company.enabled ? "Disable scanning" : "Enable scanning"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
