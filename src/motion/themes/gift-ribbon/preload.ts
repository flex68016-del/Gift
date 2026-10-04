/**
 * Manifeste de préchargement pour le thème Cadeau
 * Partie B §10.3 : critical ≤ 150 Ko
 */

export const preloadManifest = {
  critical: [], // CSS généré dynamiquement, pas d'assets statiques critiques (~50KB estimé)
  deferred: [], // Pas d'images statiques
};
