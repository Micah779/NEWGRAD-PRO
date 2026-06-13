import { getDataDb } from "@/lib/data";
import { requireUserEmail } from "@/lib/session";
import { getActiveListings, getLatestScanRun } from "@/scan/engine";
import { JobsBoard } from "@/components/jobs/jobs-board";
import { ScanStatus } from "@/components/jobs/scan-status";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const userEmail = await requireUserEmail();
  const db = getDataDb();
  const [listings, latestScan] = db
    ? await Promise.all([getActiveListings(db, userEmail), getLatestScanRun(db)])
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
    <div className="space-y-5">
      <PageHeader
        title="Jobs"
        description="Active new-grad software engineering openings at your target companies."
      />
      <ScanStatus latestScan={latestScan} />
      <JobsBoard listings={serialized} />
    </div>
  );
}
