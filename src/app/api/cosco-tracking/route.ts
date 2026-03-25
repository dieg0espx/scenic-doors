import { NextRequest, NextResponse } from "next/server";

const COSCO_BASE = "https://elines.coscoshipping.com/ebtracking/public";
const COSCO_REFERER = "https://elines.coscoshipping.com/ebusiness/cargoTracking";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function coscoFetch(path: string): Promise<Response> {
  return fetch(`${COSCO_BASE}${path}`, {
    headers: {
      Referer: COSCO_REFERER,
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const trackingNumber = searchParams.get("number");

  if (!trackingNumber) {
    return NextResponse.json({ error: "Missing tracking number" }, { status: 400 });
  }

  try {
    const res = await coscoFetch(`/bill/${encodeURIComponent(trackingNumber)}`);
    const data = await res.json();

    if (data.code !== "200" || !data.data?.content) {
      return NextResponse.json({ error: "Tracking not found", milestones: [], route: null });
    }

    const content = data.data.content;
    const trackingPath = content.trackingPath || {};
    const shipments: any[] = content.actualShipment || [];
    const containers: any[] = content.cargoTrackingContainer || [];

    // Build route info from trackingPath (object with origin/destination)
    const route = {
      from: trackingPath.fromCity || "",
      to: trackingPath.toCity || "",
      vessel: trackingPath.vslNme || "",
      voyage: trackingPath.voyNumber || "",
      blType: trackingPath.blRealStatus || trackingPath.blType || "",
    };

    // Build milestones from actualShipment array (each leg of the voyage)
    const milestones: any[] = [];

    for (const leg of shipments) {
      // Gate-in / loaded at port of loading
      if (leg.actualShippingDate) {
        milestones.push({
          date: leg.actualShippingDate,
          activity: `Loaded at ${leg.portOfLoading || "origin"}`,
          location: leg.portOfLoading || "",
          vessel: leg.vesselName || "",
          voyage: leg.voyageNo || "",
        });
      }

      // Departed port of loading
      if (leg.actualDepartureDate) {
        milestones.push({
          date: leg.actualDepartureDate,
          activity: `Departed ${leg.portOfLoading || "origin"}`,
          location: leg.portOfLoading || "",
          vessel: leg.vesselName || "",
          voyage: leg.voyageNo || "",
        });
      }

      // Arrived at port of discharge
      if (leg.actualArrivalDate) {
        milestones.push({
          date: leg.actualArrivalDate,
          activity: `Arrived at ${leg.portOfDischarge || "destination"}`,
          location: leg.portOfDischarge || "",
          vessel: leg.vesselName || "",
          voyage: leg.voyageNo || "",
        });
      }

      // Discharged at port of discharge
      if (leg.actualDischargeDate) {
        milestones.push({
          date: leg.actualDischargeDate,
          activity: `Discharged at ${leg.portOfDischarge || "destination"}`,
          location: leg.portOfDischarge || "",
          vessel: leg.vesselName || "",
          voyage: leg.voyageNo || "",
        });
      }

      // If vessel hasn't arrived yet, show ETA
      if (!leg.actualArrivalDate && leg.estimatedDateOfArrival) {
        milestones.push({
          date: leg.estimatedDateOfArrival,
          activity: `ETA at ${leg.portOfDischarge || "destination"}`,
          location: leg.portOfDischarge || "",
          vessel: leg.vesselName || "",
          voyage: leg.voyageNo || "",
          isEstimate: true,
        });
      }
    }

    // Cargo available time
    if (trackingPath.cgoAvailTm) {
      milestones.push({
        date: trackingPath.cgoAvailTm,
        activity: "Cargo available for pickup",
        location: route.to.split(",")[0] || "",
      });
    }

    // Sort by date
    milestones.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Container info
    const containerNumbers = containers.map((c: any) => c.cntrNum).filter(Boolean);

    return NextResponse.json({
      route,
      milestones,
      containers: containerNumbers,
    });
  } catch (err) {
    console.error("COSCO tracking fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch tracking data", milestones: [], route: null },
      { status: 502 }
    );
  }
}
