import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const listingStatusEnum = pgEnum("listing_status", ["active", "closed"]);
export const applicationStageEnum = pgEnum("application_stage", [
  "applied",
  "screening",
  "oa",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
]);

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  adapterKey: text("adapter_key").notNull(),
  careersUrl: text("careers_url").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const jobListings = pgTable(
  "job_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    externalId: text("external_id").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    locations: text("locations").array().notNull().default([]),
    status: listingStatusEnum("status").notNull().default("active"),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("job_listings_company_external_idx").on(
      table.companyId,
      table.externalId,
    ),
  ],
);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => jobListings.id, { onDelete: "cascade" }),
  stage: applicationStageEnum("stage").notNull().default("applied"),
  appliedAt: timestamp("applied_at", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes"),
  snapshotTitle: text("snapshot_title").notNull(),
  snapshotUrl: text("snapshot_url").notNull(),
  snapshotCompany: text("snapshot_company").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applicationEvents = pgTable("application_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  fromStage: applicationStageEnum("from_stage"),
  toStage: applicationStageEnum("to_stage").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ScanCompanyResult = {
  companySlug: string;
  success: boolean;
  jobsFound: number;
  newGradJobs: number;
  error?: string;
};

export const scanRuns = pgTable("scan_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  results: jsonb("results").$type<ScanCompanyResult[]>().notNull().default([]),
  success: boolean("success").notNull().default(false),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  listings: many(jobListings),
}));

export const jobListingsRelations = relations(jobListings, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobListings.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  listing: one(jobListings, {
    fields: [applications.listingId],
    references: [jobListings.id],
  }),
  events: many(applicationEvents),
}));

export const applicationEventsRelations = relations(applicationEvents, ({ one }) => ({
  application: one(applications, {
    fields: [applicationEvents.applicationId],
    references: [applications.id],
  }),
}));

export type Company = typeof companies.$inferSelect;
export type JobListing = typeof jobListings.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationEvent = typeof applicationEvents.$inferSelect;
export type ScanRun = typeof scanRuns.$inferSelect;
export type ApplicationStage = (typeof applicationStageEnum.enumValues)[number];
