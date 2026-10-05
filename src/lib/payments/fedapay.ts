/**
 * Implémentation FedaPay du PaymentProvider
 * Cible les marchés togolais et béninois (MTN MoMo, Moov Money, Mixx by Yas, cartes)
 */

import { PaymentProvider, CheckoutRequest, CheckoutResponse, Transaction, WebhookEvent } from "./provider";
import { env } from "../env";
import crypto from "crypto";

/**
 * Client FedaPay (placeholder pour l'API REST)
 * À remplacer par le SDK officiel ou une implémentation fetch
 */
class FedaPayClient {
  private apiKey: string;
  private mode: "sandbox" | "production";
  private baseUrl: string;

  constructor() {
    this.apiKey = env.FEDAPAY_SECRET_KEY;
    this.mode = env.FEDAPAY_ENV;
    this.baseUrl = this.mode === "production"
      ? "https://api.fedapay.com/v1"
      : "https://sandbox.fedapay.com/v1";
  }

  async createTransaction(data: {
    amount: number;
    description: string;
    currency: { iso: string };
    customer: { email: string; phone?: string; name?: string };
    callback_url?: string;
  }): Promise<{ id: string; checkout_url: string }> {
    // TODO: Implémenter l'appel API réel avec fetch
    // Pour l'instant, placeholder
    console.log("FedaPay createTransaction:", data);

    const transactionId = `txn_${Date.now()}`;

    return {
      id: transactionId,
      checkout_url: `${this.baseUrl}/checkout/${transactionId}`,
    };
  }

  async getTransaction(transactionId: string): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: { iso: string };
    created_at: string;
  }> {
    // TODO: Implémenter l'appel API réel avec fetch
    // Pour l'instant, placeholder
    console.log("FedaPay getTransaction:", transactionId);

    return {
      id: transactionId,
      status: "approved",
      amount: 1500,
      currency: { iso: "XOF" },
      created_at: new Date().toISOString(),
    };
  }
}

const client = new FedaPayClient();

export class FedaPayProvider implements PaymentProvider {
  async createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await client.createTransaction({
      amount: request.amount,
      description: request.description,
      currency: { iso: request.currency },
      customer: {
        email: request.customerEmail,
        phone: request.customerPhone,
        name: request.customerName,
      },
      callback_url: `${env.NEXT_PUBLIC_APP_URL}/api/webhooks/fedapay`,
    });

    return {
      transactionId: response.id,
      checkoutUrl: response.checkout_url,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 heure
    };
  }

  verifyWebhook(payload: string, signature: string, timestamp?: string, secret?: string): boolean {
    // Vérifier le timestamp si fourni (tolérance de 5 minutes)
    if (timestamp) {
      const webhookTime = parseInt(timestamp, 10);
      const now = Math.floor(Date.now() / 1000);
      const tolerance = 5 * 60; // 5 minutes

      if (Math.abs(now - webhookTime) > tolerance) {
        return false;
      }
    }

    // Utiliser le secret fourni ou le secret actuel par défaut
    const webhookSecret = secret || env.FEDAPAY_WEBHOOK_SECRET;

    // Vérifier la signature avec temps constant
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    // Comparaison à temps constant pour éviter les attaques par timing
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  async fetchTransaction(transactionId: string): Promise<Transaction> {
    const response = await client.getTransaction(transactionId);

    return {
      id: response.id,
      status: this.mapStatus(response.status),
      amount: response.amount,
      currency: response.currency.iso,
      createdAt: new Date(response.created_at),
    };
  }

  parseWebhook(payload: string): WebhookEvent {
    const data = JSON.parse(payload);

    return {
      eventId: data.id || data.event_id,
      eventType: data.event || data.event_type,
      transactionId: data.transaction?.id || data.transaction_id,
      status: data.transaction?.status || data.status,
      amount: data.transaction?.amount || data.amount,
      currency: data.transaction?.currency?.iso || data.currency,
      timestamp: new Date(data.created_at || data.timestamp),
      rawPayload: data,
    };
  }

  private mapStatus(status: string): Transaction["status"] {
    const statusMap: Record<string, Transaction["status"]> = {
      pending: "pending",
      approved: "approved",
      declined: "declined",
      canceled: "canceled",
      refunded: "refunded",
    };

    return statusMap[status] || "pending";
  }
}

export const fedapayProvider = new FedaPayProvider();
