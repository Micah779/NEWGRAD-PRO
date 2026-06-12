import "dotenv/config";
import { createDb } from "@/db";
import { seedCompanies } from "@/db/seed";

async function main() {
  const db = createDb();
  await seedCompanies(db);
  console.log("Companies seeded");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
