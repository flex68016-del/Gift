export type PerformanceTier = "lite" | "standard" | "ultra";

/**
 * Détecte le niveau de performance du device
 * Basé sur le CDC Partie B §10.2
 */
export function detectTier(): PerformanceTier {
  if (typeof window === "undefined") {
    return "standard";
  }

  // Mémoire (environ 4 GB de RAM)
  const memoryLimit = (navigator as any).deviceMemory;
  if (memoryLimit && memoryLimit < 4) {
    return "lite";
  }

  // Nombre de coeurs CPU
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) {
    return "lite";
  }

  // Détection du réseau
  const connection = (navigator as any).connection;
  if (connection) {
    if (connection.effectiveType === "2g" || connection.effectiveType === "slow-2g") {
      return "lite";
    }
    if (connection.saveData) {
      return "lite";
    }
  }

  // Détection mobile bas de gamme
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  if (isMobile && memoryLimit < 4) {
    return "lite";
  }

  // Détection ultra
  if (memoryLimit && memoryLimit >= 8 && cores && cores >= 8) {
    return "ultra";
  }

  return "standard";
}

/**
 * Force un niveau de performance (pour développement/tests)
 */
let forcedTier: PerformanceTier | null = null;

export function forceTier(tier: PerformanceTier | null): void {
  forcedTier = tier;
}

export function getTier(): PerformanceTier {
  if (forcedTier) {
    return forcedTier;
  }
  return detectTier();
}
