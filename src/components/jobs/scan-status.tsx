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
    <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-black/[0.06] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-[var(--foreground)]">Scan health</p>
          {latestScan ? (
            <Badge variant={latestScan.success ? "success" : "warning"}>
              {latestScan.success ? "Healthy" : "Partial failure"}
            </Badge>
          ) : (
            <Badge variant="outline">Not scanned</Badge>
          )}
        </div>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {lastScannedAt
            ? `Last scanned ${formatRelativeTime(new Date(lastScannedAt))}`
            : "No scans yet"}
          {totalCount > 0 ? ` · ${successCount}/${totalCount} companies OK` : ""}
        </p>
        {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
      </div>
      <Button
        onClick={handleScan}
        disabled={loading}
        size="sm"
        className="w-full shrink-0 sm:w-auto"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Scanning..." : "Scan now"}
      </Button>
    </div>
  );
}
