"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <CardContent className="py-16 text-center">
          <p className="text-sm text-[var(--muted)]">
            No active new-grad openings yet.
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Run a scan to check target companies.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Company
          </label>
          <select
            className="h-11 min-h-[44px] w-full appearance-none rounded-[var(--radius-sm)] border border-black/[0.08] bg-white px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
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
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
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
        <section key={group.company} className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
              {group.company}
            </h2>
            <Badge variant="secondary">{group.listings.length}</Badge>
          </div>
          <div className="divide-y divide-black/[0.06] overflow-hidden rounded-[var(--radius)] border border-black/[0.06] bg-white">
            {group.listings.map((listing) => {
              const applied = listing.applications.length > 0;

              return (
                <article key={listing.id} className="p-4">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="text-[15px] font-medium leading-snug text-[var(--foreground)]">
                          {listing.title}
                        </h3>
                        {isNewListing(listing.firstSeenAt) ? (
                          <Badge variant="success">New</Badge>
                        ) : null}
                        {applied ? <Badge variant="outline">Applied</Badge> : null}
                      </div>
                      <p className="text-sm text-[var(--muted)]">
                        {listing.locations.join(" · ") || "Location not listed"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                        <a href={listing.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          View listing
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto"
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
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
