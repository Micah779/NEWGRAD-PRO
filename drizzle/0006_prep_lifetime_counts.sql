ALTER TABLE "prep_card_progress" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "practice_problem_progress" ADD COLUMN "completion_count" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "prep_card_progress"
SET "review_count" = GREATEST("reps", CASE WHEN "last_reviewed_at" IS NOT NULL THEN 1 ELSE 0 END);
--> statement-breakpoint
UPDATE "practice_problem_progress"
SET "completion_count" = GREATEST("reps", CASE WHEN "last_reviewed_at" IS NOT NULL THEN 1 ELSE 0 END);
