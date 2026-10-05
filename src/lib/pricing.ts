/**
 * Grille tarifaire
 * Les prix sont définis côté serveur uniquement et ne sont jamais envoyés au client
 */

export type Plan = "standard" | "premium";

export interface PricingTier {
  plan: Plan;
  amount: number; // En XOF
  currency: string;
  name: string;
  features: string[];
}

/**
 * Grille tarifaire (modifiable selon les besoins)
 * Standard : 1 500 XOF (≈ 2,30 €)
 * Premium : à définir plus tard
 */
export const PRICING_TIERS: Record<Plan, PricingTier> = {
  standard: {
    plan: "standard",
    amount: 1500,
    currency: "XOF",
    name: "Standard",
    features: [
      "Thèmes cinématiques",
      "Blocs illimités",
      "Musique intégrée",
      "Stockage 5 ans",
      "Partage WhatsApp",
    ],
  },
  premium: {
    plan: "premium",
    amount: 3000, // À définir
    currency: "XOF",
    name: "Premium",
    features: [
      "Tout Standard",
      "Thèmes exclusifs",
      "Stockage illimité",
      "Support prioritaire",
    ],
  },
};

/**
 * Récupérer le prix pour un plan
 */
export function getPricing(plan: Plan): PricingTier {
  return PRICING_TIERS[plan];
}

/**
 * Récupérer le montant pour un plan
 */
export function getAmount(plan: Plan): number {
  return PRICING_TIERS[plan].amount;
}

/**
 * Récupérer la devise
 */
export function getCurrency(): string {
  return "XOF";
}
