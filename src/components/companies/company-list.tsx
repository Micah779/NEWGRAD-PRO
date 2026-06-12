"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid gap-4">
      {companies.map((company) => (
        <Card key={company.id}>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>{company.name}</CardTitle>
              <a
                href={company.careersUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                {company.careersUrl}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {company.lastScan ? (
                <Badge variant={company.lastScan.success ? "success" : "destructive"}>
                  {company.lastScan.success
                    ? `${company.lastScan.newGradJobs} new-grad roles`
                    : "Scan failed"}
                </Badge>
              ) : (
                <Badge variant="outline">No scan data</Badge>
              )}
              <Badge variant={company.enabled ? "default" : "secondary"}>
                {company.enabled ? "Enabled" : "Disabled"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                disabled={updatingId === company.id}
                onClick={() => toggleCompany(company)}
              >
                {company.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            {company.lastScannedAt
              ? `Last scanned ${formatRelativeTime(new Date(company.lastScannedAt))}`
              : "Not scanned yet"}
            {company.lastScan?.error ? ` · ${company.lastScan.error}` : ""}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
