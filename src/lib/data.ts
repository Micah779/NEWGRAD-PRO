import { getDb, type Db } from "@/db";

export function getDataDb(): Db | null {
  if (!process.env.DATABASE_URL) {
    if (process.env.E2E_TEST_MODE === "true") {
      return null;
    }
    throw new Error("DATABASE_URL is not set");
  }

  return getDb();
}
