import { db } from "../../db/client";
import { fedapayProvider } from "../../payments/fedapay";
import { registerJob } from "../registry";

interface ReconcilePaymentsPayload {
  // Payload vide, exécuté périodiquement
}

const MAX_CONSECUTIVE_FAILURES = 3;
const PENDING_THRESHOLD_MINUTES = 5;

async function reconcilePaymentsHandler(payload: ReconcilePaymentsPayload): Promise<void> {
  try {
    // Récupérer les paiements pending depuis plus de 5 minutes
    const pendingPayments = await db`
      SELECT id, gift_id, transaction_id, created_at
      FROM payments
      WHERE status = 'pending'
        AND created_at < NOW() - INTERVAL '${PENDING_THRESHOLD_MINUTES} minutes'
      ORDER BY created_at ASC
      LIMIT 100
    `;

    if (!pendingPayments || pendingPayments.length === 0) {
      return;
    }

    let consecutiveFailures = 0;

    for (const payment of pendingPayments) {
      try {
        // Récupérer le statut depuis l'API FedaPay
        const transaction = await fedapayProvider.fetchTransaction(payment.transaction_id);

        // Verrouiller le paiement pour éviter les race conditions
        await db`BEGIN`;

        try {
          const lockedPayment = await db`
            SELECT id, status
            FROM payments
            WHERE id = ${payment.id}
            FOR UPDATE
          `;

          if (!lockedPayment || lockedPayment.length === 0) {
            await db`ROLLBACK`;
            continue;
          }

          const lockedPaymentData = lockedPayment[0];
          if (!lockedPaymentData) {
            await db`ROLLBACK`;
            continue;
          }

          // Vérifier que le paiement est toujours pending
          if (lockedPaymentData.status !== "pending") {
            await db`ROLLBACK`;
            consecutiveFailures = 0;
            continue;
          }

          // Mettre à jour le statut
          await db`
            UPDATE payments
            SET status = ${transaction.status}, updated_at = NOW()
            WHERE id = ${payment.id}
          `;

          // Si approuvé, publier le cadeau
          if (transaction.status === "approved") {
            await db`SELECT publish_gift(${payment.gift_id})`;
          }

          await db`COMMIT`;
          consecutiveFailures = 0;
        } catch (error) {
          await db`ROLLBACK`;
          throw error;
        }
      } catch (error) {
        consecutiveFailures++;
        console.error(`Failed to reconcile payment ${payment.id}:`, error);

        // Disjoncteur : si 3 échecs consécutifs, alerte
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.error("Payment reconciliation circuit breaker triggered after consecutive failures");
          // TODO: Envoyer une alerte (email, Slack, Sentry)
          // TODO: Quand le fournisseur de secours sera implémenté, basculer automatiquement
          break;
        }
      }
    }
  } catch (error) {
    console.error("Reconcile payments job error:", error);
    throw error;
  }
}

registerJob({
  name: "reconcile-payments",
  handler: (payload: Record<string, unknown>) => reconcilePaymentsHandler(payload as unknown as ReconcilePaymentsPayload),
  maxRetries: 3,
  retryDelay: 60, // 1 minute
});
