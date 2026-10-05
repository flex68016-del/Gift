import { NextRequest, NextResponse } from "next/server";

import { fedapayProvider } from "@/lib/payments/fedapay";
import { db } from "@/lib/db/client";
import { invalidateAllGiftCaches } from "@/lib/cache";
import { publishJob } from "@/lib/queue/client";

export async function POST(request: NextRequest) {
  try {
    // Lire le corps brut avant tout parsing
    const rawBody = await request.text();

    // Récupérer la signature depuis l'en-tête
    const signature = request.headers.get("x-fedapay-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 },
      );
    }

    // Récupérer le timestamp si disponible
    const timestamp = request.headers.get("x-fedapay-timestamp");

    // Vérifier la signature avec le secret actuel
    const isValid = fedapayProvider.verifyWebhook(rawBody, signature, timestamp || undefined);

    // Si invalide, essayer avec le secret précédent (rotation)
    if (!isValid && process.env.FEDAPAY_WEBHOOK_SECRET_PREVIOUS) {
      const isValidWithPrevious = fedapayProvider.verifyWebhook(
        rawBody,
        signature,
        timestamp || undefined,
        process.env.FEDAPAY_WEBHOOK_SECRET_PREVIOUS,
      );
      if (!isValidWithPrevious) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 },
        );
      }
    }

    // Parser le webhook
    const event = fedapayProvider.parseWebhook(rawBody);

    // Vérifier l'idempotence : insérer dans webhook_events
    // Si doublon, retourner 200 sans effet
    const existingEvent = await db`
      SELECT id FROM webhook_events
      WHERE provider = 'fedapay' AND event_id = ${event.eventId}
      LIMIT 1
    `;

    if (existingEvent && existingEvent.length > 0) {
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // Insérer l'événement
    await db`
      INSERT INTO webhook_events (provider, event_id, payload, created_at)
      VALUES ('fedapay', ${event.eventId}, ${rawBody}, NOW())
    `;

    // Récupérer le paiement correspondant
    const payment = await db`
      SELECT id, gift_id, amount, currency, status, customer_email
      FROM payments
      WHERE transaction_id = ${event.transactionId}
      LIMIT 1
    `;

    if (!payment || payment.length === 0) {
      console.error("Payment not found for transaction:", event.transactionId);
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    const paymentData = payment[0];
    if (!paymentData) {
      console.error("Payment data is null");
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // Récupérer la transaction depuis l'API FedaPay pour vérifier
    const transaction = await fedapayProvider.fetchTransaction(event.transactionId);

    // Vérifier que le montant et la devise correspondent
    if (transaction.amount !== paymentData.amount || transaction.currency !== paymentData.currency) {
      console.error("Amount mismatch:", {
        expected: { amount: paymentData.amount, currency: paymentData.currency },
        received: { amount: transaction.amount, currency: transaction.currency },
      });
      // Journaliser l'événement de sécurité
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // Verrouiller le paiement pour éviter les race conditions
    await db`BEGIN`;

    try {
      // Récupérer le paiement avec verrou
      const lockedPayment = await db`
        SELECT id, gift_id, status
        FROM payments
        WHERE id = ${paymentData.id}
        FOR UPDATE
      `;

      if (!lockedPayment || lockedPayment.length === 0) {
        await db`ROLLBACK`;
        return NextResponse.json({ status: "ok" }, { status: 200 });
      }

      const lockedPaymentData = lockedPayment[0];
      if (!lockedPaymentData) {
        await db`ROLLBACK`;
        return NextResponse.json({ status: "ok" }, { status: 200 });
      }

      // Vérifier que le paiement est toujours pending
      if (lockedPaymentData.status !== "pending") {
        await db`ROLLBACK`;
        return NextResponse.json({ status: "ok" }, { status: 200 });
      }

      // Mettre à jour le statut du paiement
      await db`
        UPDATE payments
        SET status = ${transaction.status}, updated_at = NOW()
        WHERE id = ${paymentData.id}
      `;

      // Si approuvé, publier le cadeau
      if (transaction.status === "approved") {
        // Appeler la fonction SQL publish_gift
        await db`SELECT publish_gift(${lockedPaymentData.gift_id})`;

        // Invalider le cache
        await invalidateAllGiftCaches(lockedPaymentData.gift_id, "");

        // Mettre en file l'e-mail de confirmation
        await publishJob({
          name: "send-email",
          payload: {
            to: paymentData.customer_email,
            template: "gift-published",
            data: {
              gift_id: lockedPaymentData.gift_id,
            },
          },
        });
      }

      await db`COMMIT`;
    } catch (error) {
      await db`ROLLBACK`;
      throw error;
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
