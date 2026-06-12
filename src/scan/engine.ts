import { and, eq, notInArray } from "drizzle-orm";
import type { Db } from "@/db";
import {
  applicationEvents,
  applications,
  companies,
  jobListings,
  scanRuns,
  type ScanCompanyResult,
} from "@/db/schema";
import { isNewGradRole } from "@/lib/classifier";
import { getAdapter } from "./adapters";
import { seedCompanies } from "@/db/seed";
import type { RawJob } from "./types";

export function filterNewGradJobs(jobs: RawJob[]) {
  return jobs.filter((job) => isNewGradRole(job.title, job.description ?? ""));
}

export async function syncCompanyJobs(
  db: Db,
  company: typeof companies.$inferSelect,
  jobs: RawJob[],
) {
  const now = new Date();
  const newGradJobs = filterNewGradJobs(jobs);
  const seenExternalIds = newGradJobs.map((job) => job.externalId);

  for (const job of newGradJobs) {
    await db
      .insert(jobListings)
      .values({
        companyId: company.id,
        externalId: job.externalId,
        title: job.title,
        url: job.url,
        locations: job.locations,
        status: "active",
        firstSeenAt: now,
        lastSeenAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [jobListings.companyId, jobListings.externalId],
        set: {
          title: job.title,
          url: job.url,
          locations: job.locations,
          status: "active",
          lastSeenAt: now,
          updatedAt: now,
        },
      });
  }

  if (seenExternalIds.length === 0) {
    const appliedListingIds = await db
      .select({ listingId: applications.listingId })
      .from(applications);

    const protectedIds = appliedListingIds.map((row) => row.listingId);

    if (protectedIds.length === 0) {
      await db
        .update(jobListings)
        .set({ status: "closed", updatedAt: now })
        .where(eq(jobListings.companyId, company.id));
    } else {
      await db
        .update(jobListings)
        .set({ status: "closed", updatedAt: now })
        .where(
          and(
            eq(jobListings.companyId, company.id),
            notInArray(jobListings.id, protectedIds),
          ),
        );
    }
  } else {
    const appliedListingIds = await db
      .select({ listingId: applications.listingId })
      .from(applications);

    const protectedIds = appliedListingIds.map((row) => row.listingId);

    const closableCondition = and(
      eq(jobListings.companyId, company.id),
      notInArray(jobListings.externalId, seenExternalIds),
    );

    if (protectedIds.length > 0) {
      await db
        .update(jobListings)
        .set({ status: "closed", updatedAt: now })
        .where(
          and(closableCondition, notInArray(jobListings.id, protectedIds)),
        );
    } else {
      await db
        .update(jobListings)
        .set({ status: "closed", updatedAt: now })
        .where(closableCondition);
    }
  }

  return {
    jobsFound: jobs.length,
    newGradJobs: newGradJobs.length,
  };
}

export async function runScan(db: Db) {
  await seedCompanies(db);

  const enabledCompanies = await db
    .select()
    .from(companies)
    .where(eq(companies.enabled, true));

  const startedAt = new Date();
  const [scanRun] = await db
    .insert(scanRuns)
    .values({
      startedAt,
      results: [],
      success: false,
    })
    .returning();

  const results: ScanCompanyResult[] = [];

  for (const company of enabledCompanies) {
    const adapter = getAdapter(company.adapterKey);

    if (!adapter) {
      results.push({
        companySlug: company.slug,
        success: false,
        jobsFound: 0,
        newGradJobs: 0,
        error: `Unknown adapter: ${company.adapterKey}`,
      });
      continue;
    }

    try {
      const jobs = await adapter.fetchJobs();
      const syncResult = await syncCompanyJobs(db, company, jobs);

      results.push({
        companySlug: company.slug,
        success: true,
        jobsFound: syncResult.jobsFound,
        newGradJobs: syncResult.newGradJobs,
      });
    } catch (error) {
      results.push({
        companySlug: company.slug,
        success: false,
        jobsFound: 0,
        newGradJobs: 0,
        error: error instanceof Error ? error.message : "Unknown scan error",
      });
    }
  }

  const finishedAt = new Date();
  const success = results.some((result) => result.success);

  await db
    .update(scanRuns)
    .set({
      finishedAt,
      results,
      success,
    })
    .where(eq(scanRuns.id, scanRun.id));

  return {
    scanRunId: scanRun.id,
    startedAt,
    finishedAt,
    results,
    success,
  };
}

export async function getLatestScanRun(db: Db) {
  const rows = await db.select().from(scanRuns);
  const latest = rows.sort(
    (a, b) => b.startedAt.getTime() - a.startedAt.getTime(),
  )[0];

  return latest ?? null;
}

export async function getActiveListings(db: Db) {
  return db.query.jobListings.findMany({
    where: eq(jobListings.status, "active"),
    with: {
      company: true,
      applications: true,
    },
    orderBy: (listings, { desc }) => [desc(listings.firstSeenAt)],
  });
}

export async function getCompaniesWithScanStatus(db: Db) {
  const allCompanies = await db.select().from(companies).orderBy(companies.name);
  const latest = await getLatestScanRun(db);
  const resultMap = new Map(
    (latest?.results ?? []).map((result) => [result.companySlug, result]),
  );

  return allCompanies.map((company) => ({
    ...company,
    lastScan: resultMap.get(company.slug) ?? null,
    lastScannedAt: latest?.finishedAt ?? latest?.startedAt ?? null,
  }));
}

export async function markListingApplied(
  db: Db,
  listingId: string,
  notes?: string,
) {
  const listing = await db.query.jobListings.findFirst({
    where: eq(jobListings.id, listingId),
    with: { company: true, applications: true },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.applications.length > 0) {
    return listing.applications[0];
  }

  const [application] = await db
    .insert(applications)
    .values({
      listingId: listing.id,
      stage: "applied",
      notes: notes ?? null,
      snapshotTitle: listing.title,
      snapshotUrl: listing.url,
      snapshotCompany: listing.company.name,
    })
    .returning();

  await db.insert(applicationEvents).values({
    applicationId: application.id,
    fromStage: null,
    toStage: "applied",
  });

  return application;
}
