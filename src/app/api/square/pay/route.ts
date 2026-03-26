import { NextRequest, NextResponse } from "next/server";
import { SquareClient } from "square";
import { randomUUID } from "crypto";

const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com",
});

export async function POST(req: NextRequest) {
  try {
    const { sourceId, amount, paymentId, clientName } = await req.json();

    if (!sourceId || !amount || !paymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountCents = Math.round(Number(amount) * 100);

    const response = await square.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(amountCents),
        currency: "USD",
      },
      note: `Scenic Doors — Payment ${paymentId}${clientName ? ` — ${clientName}` : ""}`,
    });

    const squarePaymentId = response.payment?.id;
    const status = response.payment?.status;

    if (status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment was not completed", status },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, squarePaymentId });
  } catch (err: unknown) {
    console.error("Square payment error:", err);
    const message = err instanceof Error ? err.message : "Payment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
