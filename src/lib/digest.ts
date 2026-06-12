import { and, eq, gte } from "drizzle-orm";
import type { Db } from "@/db";
import { companies, jobListings } from "@/db/schema";
import type { ScanCompanyResult } from "@/db/schema";
import {
  buildDigestHtml,
  DIGEST_SUBJECT,
  getDigestRecipients,
  sendEmail,
} from "@/lib/email";

const DIGEST_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function getNewListingsForDigest(db: Db) {
  const since = new Date(Date.now() - DIGEST_WINDOW_MS);

  return db.query.jobListings.findMany({
    where: and(
      eq(jobListings.status, "active"),
      gte(jobListings.firstSeenAt, since),
    ),
    with: { company: true },
    orderBy: (listings, { desc }) => [desc(listings.firstSeenAt)],
  });
}

export async function buildDigestStats(
  db: Db,
  scanResults: ScanCompanyResult[],
) {
  const allCompanies = await db.select().from(companies);
  const companiesDisabled = allCompanies.filter((company) => !company.enabled).length;
  const companiesFailed = scanResults.filter((result) => !result.success).length;

  return {
    companiesChecked: scanResults.length,
    companiesDisabled,
    companiesFailed,
  };
}

export async function sendMorningDigest(
  db: Db,
  scanResults: ScanCompanyResult[],
) {
  const listings = await getNewListingsForDigest(db);
  const stats = await buildDigestStats(db, scanResults);

  const html = buildDigestHtml(
    listings.map((listing) => ({
      companyName: listing.company.name,
      title: listing.title,
      locations: listing.locations,
      url: listing.url,
    })),
    stats,
  );

  const recipients = getDigestRecipients();
  const emailResult = await sendEmail({
    to: recipients,
    subject: DIGEST_SUBJECT,
    html,
  });

  return {
    emailId: emailResult.id,
    recipientCount: recipients.length,
    listingCount: listings.length,
    stats,
  };
}
