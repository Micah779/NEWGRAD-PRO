import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { applicationEvents, applications } from "@/db/schema";
import { getSessionUserEmail } from "@/lib/session";

const updateSchema = z.object({
  stage: z.enum([
    "applied",
    "screening",
    "oa",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ]),
  notes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userEmail = await getSessionUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = updateSchema.parse(await request.json());
    const db = getDb();

    const [existing] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userEmail, userEmail)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(applications)
      .set({
        stage: body.stage,
        notes: body.notes ?? existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();

    if (existing.stage !== body.stage) {
      await db.insert(applicationEvents).values({
        applicationId: id,
        fromStage: existing.stage,
        toStage: body.stage,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update application",
      },
      { status: 400 },
    );
  }
}
