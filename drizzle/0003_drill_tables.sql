CREATE TABLE "drill_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"topic_slug" text NOT NULL,
	"topic" text NOT NULL,
	"scenario" text NOT NULL,
	"choices" jsonb NOT NULL,
	"correct_choice_id" text NOT NULL,
	"explanation" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drill_questions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "drill_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"selected_choice_id" text NOT NULL,
	"correct" boolean NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "drill_attempts" ADD CONSTRAINT "drill_attempts_question_id_drill_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."drill_questions"("id") ON DELETE cascade ON UPDATE no action;
