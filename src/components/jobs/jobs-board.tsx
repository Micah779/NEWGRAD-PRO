"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Listing = {
  id: string;
  title: string;
  url: string;
  locations: string[];
  firstSeenAt: string;
  company: {
    name: string;
    slug: string;
  };
  applications: Array<{ id: string }>;
};

type JobsBoardProps = {
  listings: Listing[];
};

function isNewListing(firstSeenAt: string) {
  const hours = (Date.now() - new Date(firstSeenAt).getTime()) / (1000 * 60 * 60);
  return hours < 48;
}

export function JobsBoard({ listings }: JobsBoardProps) {
  const router = useRouter();
  const [companyFilter, setCompanyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const companies = useMemo(
    () => [...new Set(listings.map((listing) => listing.company.name))].sort(),
    [listings],
  );

  const filtered = listings.filter((listing) => {
    const companyMatch =
      companyFilter === "all" || listing.company.name === companyFilter;
    const locationMatch =
      locationFilter.trim() === "" ||
      listing.locations.some((location) =>
        location.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    return companyMatch && locationMatch;
  });

  const grouped = companies
    .filter((company) =>
      filtered.some((listing) => listing.company.name === company),
    )
    .map((company) => ({
      company,
      listings: filtered.filter((listing) => listing.company.name === company),
    }));

  async function markApplied(listingId: string) {
    setApplyingId(listingId);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to mark as applied");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to mark as applied");
    } finally {
      setApplyingId(null);
    }
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">
          No active new-grad openings yet. Run a scan to check target companies.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Company
          </label>
          <select
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
          >
            <option value="all">All companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Location
          </label>
          <Input
            placeholder="Filter by city or region"
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          />
        </div>
      </div>

      {grouped.map((group) => (
        <section key={group.company} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{group.company}</h2>
            <Badge variant="secondary">{group.listings.length} openings</Badge>
          </div>
          <div className="grid gap-3">
            {group.listings.map((listing) => {
              const applied = listing.applications.length > 0;

              return (
                <Card key={listing.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-base">{listing.title}</CardTitle>
                          {isNewListing(listing.firstSeenAt) ? (
                            <Badge variant="success">New</Badge>
                          ) : null}
                          {applied ? <Badge variant="outline">Applied</Badge> : null}
                        </div>
                        <p className="text-sm text-slate-500">
                          {listing.locations.join(" · ") || "Location not listed"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={listing.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            View listing
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          disabled={applied || applyingId === listing.id}
                          onClick={() => markApplied(listing.id)}
                        >
                          {applied
                            ? "Tracking"
                            : applyingId === listing.id
                              ? "Saving..."
                              : "Mark applied"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
