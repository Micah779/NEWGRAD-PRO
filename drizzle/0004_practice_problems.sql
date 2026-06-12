CREATE TABLE "practice_problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"leetcode_num" integer NOT NULL,
	"title" text NOT NULL,
	"topic_slug" text NOT NULL,
	"statement" text NOT NULL,
	"implementation_code" text NOT NULL,
	"pattern_choices" jsonb NOT NULL,
	"correct_pattern_choice_id" text NOT NULL,
	"pattern_explanation" text NOT NULL,
	"complexity_choices" jsonb NOT NULL,
	"correct_complexity_choice_id" text NOT NULL,
	"complexity_explanation" text NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"ease" real DEFAULT 2.5 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_problems_slug_unique" UNIQUE("slug")
);

CREATE TABLE "practice_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"stage" integer NOT NULL,
	"selected_choice_id" text NOT NULL,
	"correct" boolean NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_problem_id_practice_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."practice_problems"("id") ON DELETE cascade ON UPDATE no action;
