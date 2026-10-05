import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireGiftOwner } from "@/lib/auth/require-gift-owner";
import { assertSameOrigin } from "@/lib/security/csrf";
import { db } from "@/lib/db/client";
import { fedapayProvider } from "@/lib/payments/fedapay";
import { getAmount, getCurrency } from "@/lib/pricing";
import { invalidateAllGiftCaches } from "@/lib/cache";

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Vérification CSRF
    assertSameOrigin(request);

    // Authentifier le propriétaire du cadeau
    try {
      requireGiftOwner(request, params.id);
    } catch {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const giftId = params.id;

    // Valider le corps de la requête
    const body = await request.json();
    const { email, phone } = checkoutSchema.parse(body);

    // Récupérer le cadeau depuis la base de données
    const gift = await db`
      SELECT id, plan, status, unlock_kind, secret_hash, unlock_at, blocks
      FROM gifts
      WHERE id = ${giftId}
    `;

    if (!gift || gift.length === 0) {
      return NextResponse.json(
        { error: "Gift not found" },
        { status: 404 },
      );
    }

    const giftData = gift[0];
    if (!giftData) {
      return NextResponse.json(
        { error: "Gift not found" },
        { status: 404 },
      );
    }

    // Vérifier que le cadeau est en brouillon
    if (giftData.status !== "draft") {
      return NextResponse.json(
        { error: "Gift already published" },
        { status: 400 },
      );
    }

    // Vérifier que le cadeau est complet
    // TODO: Appeler validateGift quand le schéma est prêt
    if (!giftData.blocks || giftData.blocks.length === 0) {
      return NextResponse.json(
        { error: "Gift is incomplete" },
        { status: 400 },
      );
    }

    // Vérifier que l'ouverture est configurée
    if (giftData.unlock_kind === "secret" && !giftData.secret_hash) {
      return NextResponse.json(
        { error: "Secret not configured" },
        { status: 400 },
      );
    }

    if (giftData.unlock_kind === "scheduled" && !giftData.unlock_at) {
      return NextResponse.json(
        { error: "Scheduled date not configured" },
        { status: 400 },
      );
    }

    // Vérifier qu'il n'y a pas déjà un paiement pending
    const existingPayment = await db`
      SELECT id FROM payments
      WHERE gift_id = ${giftId} AND status = 'pending'
      LIMIT 1
    `;

    if (existingPayment && existingPayment.length > 0) {
      return NextResponse.json(
        { error: "Payment already in progress" },
        { status: 400 },
      );
    }

    // Récupérer le prix
    const amount = getAmount(giftData.plan as "standard" | "premium");
    const currency = getCurrency();

    // Créer la ligne de paiement
    const payment = await db`
      INSERT INTO payments (gift_id, amount, currency, status, customer_email, customer_phone, created_at)
      VALUES (${giftId}, ${amount}, ${currency}, 'pending', ${email}, ${phone || null}, NOW())
      RETURNING id
    `;

    const paymentId = payment[0]?.id;
    if (!paymentId) {
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 },
      );
    }

    // Créer la transaction FedaPay
    const checkout = await fedapayProvider.createCheckout({
      amount,
      currency,
      description: `Cadeau Moment - ${giftId}`,
      customerEmail: email,
      customerPhone: phone,
      metadata: {
        gift_id: giftId,
        payment_id: paymentId,
      },
    });

    // Mettre à jour le paiement avec l'ID de transaction
    await db`
      UPDATE payments
      SET transaction_id = ${checkout.transactionId}, expires_at = NOW() + INTERVAL '1 hour'
      WHERE id = ${paymentId}
    `;

    return NextResponse.json({
      transactionId: checkout.transactionId,
      checkoutUrl: checkout.checkoutUrl,
      expiresAt: checkout.expiresAt,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
