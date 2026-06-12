import type { Company } from "@/db/schema";
import type { RawJob } from "../types";

export async function fetchManualJobs(_company: Company): Promise<RawJob[]> {
  throw new Error(
    "Link-only company — enable scanning after a custom adapter is added",
  );
}
