"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { ScanRun } from "@/db/schema";

type ScanStatusProps = {
  latestScan: ScanRun | null;
};

export function ScanStatus({ latestScan }: ScanStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const successCount =
    latestScan?.results.filter((result) => result.success).length ?? 0;
  const totalCount = latestScan?.results.length ?? 0;
  const lastScannedAt = latestScan?.finishedAt ?? latestScan?.startedAt;

  async function handleScan() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scan", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Scan failed");
      }

      router.refresh();
    } catch (scanError) {
      setError(
        scanError instanceof Error ? scanError.message : "Scan failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">Scan health</p>
        <p className="text-sm text-slate-500">
          {lastScannedAt
            ? `Last scanned ${formatRelativeTime(new Date(lastScannedAt))}`
            : "No scans yet"}
          {totalCount > 0 ? ` · ${successCount}/${totalCount} companies OK` : ""}
        </p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        {latestScan ? (
          <Badge variant={latestScan.success ? "success" : "warning"}>
            {latestScan.success ? "Healthy" : "Partial failure"}
          </Badge>
        ) : (
          <Badge variant="outline">Not scanned</Badge>
        )}
        <Button onClick={handleScan} disabled={loading} size="sm">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Scanning..." : "Scan now"}
        </Button>
      </div>
    </div>
  );
}
