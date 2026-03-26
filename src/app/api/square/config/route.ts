import { NextResponse } from "next/server";
import { SquareClient } from "square";

let cachedLocationId: string | null = null;

export async function GET() {
  try {
    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
    const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

    if (!appId) {
      return NextResponse.json({ error: "Square not configured" }, { status: 500 });
    }

    // Fetch and cache the location ID from Square API
    if (!cachedLocationId) {
      const square = new SquareClient({
        token: process.env.SQUARE_ACCESS_TOKEN!,
        environment,
      });

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
    console.error("Square config error:", err);
    return NextResponse.json({ error: "Failed to load Square config" }, { status: 500 });
  }
}
