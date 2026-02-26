import { NextRequest, NextResponse } from "next/server";
import { sendPendingFollowUps } from "@/lib/cron/process-follow-ups";
import { ageLeadStatuses } from "@/lib/cron/age-lead-statuses";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || `https://${request.headers.get("host")}`;

  try {
    const [followUpResult, agingResult] = await Promise.all([
      sendPendingFollowUps(origin),
      ageLeadStatuses(),
    ]);

    return NextResponse.json({
      ok: true,
      ...followUpResult,
      aged: agingResult.aged,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
