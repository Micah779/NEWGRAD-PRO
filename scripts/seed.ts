import { config } from "dotenv";

config({ path: ".env.local" });
config();
import { createDb } from "@/db";
import { seedCompanies, seedPrepCards } from "@/db/seed";

async function main() {
  const db = createDb();
  await seedCompanies(db);
  await seedPrepCards(db);
  console.log("Companies and prep cards seeded");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
