/**
 * Interface commune pour les fournisseurs de paiement
 * Permet de changer de fournisseur (FedaPay → Stripe) sans modifier le code métier
 */

export interface CheckoutRequest {
  amount: number; // En devise locale (XOF)
  currency: string; // Code devise (XOF)
  description: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResponse {
  transactionId: string;
  checkoutUrl: string;
  expiresAt?: Date;
}

export interface Transaction {
  id: string;
  status: "pending" | "approved" | "declined" | "canceled" | "refunded";
  amount: number;
  currency: string;
  createdAt: Date;
  metadata?: Record<string, string>;
}

export interface WebhookEvent {
  eventId: string;
  eventType: string;
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: Date;
  rawPayload: unknown;
}

export interface PaymentProvider {
  /**
   * Crée une transaction de paiement et renvoie l'URL de checkout
   */
  createCheckout(request: CheckoutRequest): Promise<CheckoutResponse>;

  /**
   * Vérifie la signature d'un webhook
   */
  verifyWebhook(payload: string, signature: string, timestamp?: string): boolean;

  /**
   * Récupère les détails d'une transaction depuis l'API du fournisseur
   */
  fetchTransaction(transactionId: string): Promise<Transaction>;

  /**
   * Parse le payload brut d'un webhook en événement structuré
   */
  parseWebhook(payload: string): WebhookEvent;
}
