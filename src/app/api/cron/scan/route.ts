import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sendMorningDigest } from "@/lib/digest";
import { runScan } from "@/scan/engine";

export const maxDuration = 300;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const cronHeader = request.headers.get("x-cron-secret");
  return cronHeader === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const result = await runScan(db);

    const url = new URL(request.url);
    const shouldSendDigest = url.searchParams.get("digest") === "1";

    let digest = null;
    if (shouldSendDigest) {
      digest = await sendMorningDigest(db, result.results);
    }

    return NextResponse.json({
      ...result,
      digest,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Scan failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
