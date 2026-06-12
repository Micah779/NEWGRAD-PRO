import { getDataDb } from "@/lib/data";
import { getActiveListings, getLatestScanRun } from "@/scan/engine";
import { JobsBoard } from "@/components/jobs/jobs-board";
import { ScanStatus } from "@/components/jobs/scan-status";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const db = getDataDb();
  const [listings, latestScan] = db
    ? await Promise.all([getActiveListings(db), getLatestScanRun(db)])
    : [[], null];

  const serialized = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    url: listing.url,
    locations: listing.locations,
    firstSeenAt: listing.firstSeenAt.toISOString(),
    company: {
      name: listing.company.name,
      slug: listing.company.slug,
    },
    applications: listing.applications.map((application) => ({
      id: application.id,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Jobs Board</h2>
        <p className="text-slate-500">
          Active new-grad software engineering openings at your target companies.
        </p>
      </div>
      <ScanStatus latestScan={latestScan} />
      <JobsBoard listings={serialized} />
    </div>
  );
}
