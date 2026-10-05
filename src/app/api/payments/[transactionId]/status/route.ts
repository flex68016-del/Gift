import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    // Récupérer le paiement et les infos du cadeau
    const result = await db`
      SELECT
        p.status,
        p.gift_id,
        g.slug,
        g.edit_token
      FROM payments p
      LEFT JOIN gifts g ON p.gift_id = g.id
      WHERE p.transaction_id = ${transactionId}
        AND p.deleted_at IS NULL
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const payment = result[0];
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: payment.status,
      giftId: payment.gift_id,
      giftSlug: payment.slug,
      editToken: payment.edit_token,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
