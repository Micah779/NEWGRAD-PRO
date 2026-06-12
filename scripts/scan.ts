import { config } from "dotenv";

config({ path: ".env.local" });
config();

import { createDb } from "@/db";
import { runScan } from "@/scan/engine";

async function main() {
  const db = createDb();
  const result = await runScan(db);

  for (const company of result.results) {
    const status = company.success ? "OK" : `FAILED (${company.error})`;
    console.log(
      `${company.companySlug}: ${status} — ${company.jobsFound} jobs, ${company.newGradJobs} new-grad`,
    );
  }

  console.log(`Overall: ${result.success ? "success" : "all companies failed"}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
