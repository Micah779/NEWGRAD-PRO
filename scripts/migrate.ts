import { config } from "dotenv";

config({ path: ".env.local" });
config();
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getDefaultOwnerEmail } from "../src/lib/session";

async function runUserScopingBackfill() {
  const sql = neon(process.env.DATABASE_URL!);

  const srsColumns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'prep_cards'
      AND column_name = 'reps'
  `;

  if (srsColumns.length === 0) {
    console.log("User scoping backfill already applied");
    return;
  }

  const ownerEmail = getDefaultOwnerEmail();
  console.log(`Backfilling user data to ${ownerEmail}`);

  await sql`UPDATE applications SET user_email = ${ownerEmail} WHERE user_email IS NULL`;
  await sql`UPDATE drill_attempts SET user_email = ${ownerEmail} WHERE user_email IS NULL`;
  await sql`UPDATE practice_attempts SET user_email = ${ownerEmail} WHERE user_email IS NULL`;

  await sql`
    INSERT INTO prep_card_progress (card_id, user_email, reps, ease, interval_days, due_at, last_reviewed_at)
    SELECT id, ${ownerEmail}, reps, ease, interval_days, due_at, last_reviewed_at
    FROM prep_cards
    ON CONFLICT (card_id, user_email) DO NOTHING
  `;

  await sql`
    INSERT INTO practice_problem_progress (problem_id, user_email, reps, ease, interval_days, due_at, last_reviewed_at)
    SELECT id, ${ownerEmail}, reps, ease, interval_days, due_at, last_reviewed_at
    FROM practice_problems
    ON CONFLICT (problem_id, user_email) DO NOTHING
  `;

  await sql`ALTER TABLE applications ALTER COLUMN user_email SET NOT NULL`;
  await sql`ALTER TABLE drill_attempts ALTER COLUMN user_email SET NOT NULL`;
  await sql`ALTER TABLE practice_attempts ALTER COLUMN user_email SET NOT NULL`;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS applications_listing_user_idx
    ON applications (listing_id, user_email)
  `;

  await sql`ALTER TABLE prep_cards DROP COLUMN reps`;
  await sql`ALTER TABLE prep_cards DROP COLUMN ease`;
  await sql`ALTER TABLE prep_cards DROP COLUMN interval_days`;
  await sql`ALTER TABLE prep_cards DROP COLUMN due_at`;
  await sql`ALTER TABLE prep_cards DROP COLUMN last_reviewed_at`;

  await sql`ALTER TABLE practice_problems DROP COLUMN reps`;
  await sql`ALTER TABLE practice_problems DROP COLUMN ease`;
  await sql`ALTER TABLE practice_problems DROP COLUMN interval_days`;
  await sql`ALTER TABLE practice_problems DROP COLUMN due_at`;
  await sql`ALTER TABLE practice_problems DROP COLUMN last_reviewed_at`;

  console.log("User scoping backfill complete");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied");

  await runUserScopingBackfill();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
