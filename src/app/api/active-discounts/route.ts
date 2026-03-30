import { NextResponse } from "next/server";
import { getActiveDiscounts } from "@/lib/actions/global-discounts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const discounts = await getActiveDiscounts();
    return NextResponse.json(discounts);
  } catch {
    return NextResponse.json([]);
  }
}
