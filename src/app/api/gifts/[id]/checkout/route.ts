import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";

import { requireGiftOwner } from "@/lib/auth/require-gift-owner";
import { assertSameOrigin } from "@/lib/security/csrf";
import { db } from "@/lib/db/client";
import { fedapayProvider } from "@/lib/payments/fedapay";
import { getAmount, getCurrency } from "@/lib/pricing";
import { invalidateAllGiftCaches } from "@/lib/cache";

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  idempotencyKey: z.string().uuid().optional(),
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
    const { email, phone, idempotencyKey: clientKey } = checkoutSchema.parse(body);

    // Générer ou utiliser la clé d'idempotence
    let idempotencyKey = clientKey || randomUUID();

    // Vérifier s'il existe déjà un paiement avec cette clé
    const existingPayment = await db`
      SELECT id, transaction_id, status, expires_at
      FROM payments
      WHERE gift_id = ${giftId} AND idempotency_key = ${idempotencyKey}
      LIMIT 1
    `;

    if (existingPayment && existingPayment.length > 0) {
      const existing = existingPayment[0];
      if (!existing) {
        // Should not happen, but handle gracefully
        idempotencyKey = randomUUID();
      } else if (existing.status === "pending" || existing.status === "approved") {
        // Si le paiement est pending ou approved, retourner les infos existantes
        return NextResponse.json({
          transactionId: existing.transaction_id,
          checkoutUrl: existing.transaction_id ? `https://sandbox.fedapay.com/v1/checkout/${existing.transaction_id}` : null,
          expiresAt: existing.expires_at,
        });
      } else {
        // Si declined ou canceled, générer une nouvelle clé
        idempotencyKey = randomUUID();
      }
    }

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

    // Récupérer le prix
    const amount = getAmount(giftData.plan as "standard" | "premium");
    const currency = getCurrency();

    // Créer la ligne de paiement
    const payment = await db`
      INSERT INTO payments (gift_id, amount, currency, status, customer_email, customer_phone, idempotency_key, created_at)
      VALUES (${giftId}, ${amount}, ${currency}, 'pending', ${email}, ${phone || null}, ${idempotencyKey}, NOW())
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
