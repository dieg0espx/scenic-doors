import { NextResponse } from "next/server";
import { SquareClient } from "square";

let cachedLocationId: string | null = null;

export async function GET() {
  try {
    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

    if (!appId) {
      return NextResponse.json({ error: "Square not configured — missing APP_ID" }, { status: 500 });
    }
    if (!token) {
      return NextResponse.json({ error: "Square not configured — missing ACCESS_TOKEN" }, { status: 500 });
    }

    // Fetch and cache the location ID from Square API
    if (!cachedLocationId) {
      const square = new SquareClient({ token, environment });
      const response = await square.locations.list();
      const location = response.locations?.[0];
      if (!location?.id) {
        return NextResponse.json({ error: "No Square location found" }, { status: 500 });
      }
      cachedLocationId = location.id;
    }

    return NextResponse.json({
      appId,
      locationId: cachedLocationId,
      environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox",
    });
  } catch (err) {
    console.error("[Square Config] ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Square config failed: ${message}` }, { status: 500 });
  }
}
