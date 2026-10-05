import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } },
) {
  try {
    // Récupérer le paiement depuis la base de données
    const payment = await db`
      SELECT status, gift_id
      FROM payments
      WHERE transaction_id = ${params.transactionId}
      LIMIT 1
    `;

    if (!payment || payment.length === 0) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: payment[0]?.status,
      giftId: payment[0]?.gift_id,
    });
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
