import { NextResponse } from "next/server";
import { getEffectiveRates } from "@/lib/actions/pricing-rates";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rates = await getEffectiveRates();
    return NextResponse.json(rates);
  } catch {
    return NextResponse.json({});
  }
}
