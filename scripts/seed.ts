import { config } from "dotenv";

config({ path: ".env.local" });
config();
import { createDb } from "@/db";
import {
  seedCompanies,
  seedDrillQuestions,
  seedPracticeProblems,
  seedPrepCards,
} from "@/db/seed";

async function main() {
  const db = createDb();
  await seedCompanies(db);
  await seedPrepCards(db);
  await seedDrillQuestions(db);
  await seedPracticeProblems(db);
  console.log("Companies, prep cards, drill questions, and practice problems seeded");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
