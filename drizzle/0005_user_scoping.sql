ALTER TABLE "applications" ADD COLUMN "user_email" text;--> statement-breakpoint
ALTER TABLE "drill_attempts" ADD COLUMN "user_email" text;--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD COLUMN "user_email" text;--> statement-breakpoint
CREATE TABLE "prep_card_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"user_email" text NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"ease" real DEFAULT 2.5 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "practice_problem_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"user_email" text NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"ease" real DEFAULT 2.5 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "prep_card_progress" ADD CONSTRAINT "prep_card_progress_card_id_prep_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."prep_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_problem_progress" ADD CONSTRAINT "practice_problem_progress_problem_id_practice_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."practice_problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "prep_card_progress_card_user_idx" ON "prep_card_progress" USING btree ("card_id","user_email");--> statement-breakpoint
CREATE UNIQUE INDEX "practice_problem_progress_problem_user_idx" ON "practice_problem_progress" USING btree ("problem_id","user_email");
