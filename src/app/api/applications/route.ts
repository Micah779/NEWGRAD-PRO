import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { markListingApplied } from "@/scan/engine";
import { getSessionUserEmail } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({
  listingId: z.string().uuid(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const userEmail = await getSessionUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = createSchema.parse(await request.json());
    const db = getDb();
    const application = await markListingApplied(
      db,
      body.listingId,
      userEmail,
      body.notes,
    );
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create application",
      },
      { status: 400 },
    );
  }
}
