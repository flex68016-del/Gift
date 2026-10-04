/**
 * Preload manifest pour le thème anniversaire
 * Liste les assets à précharger pour l'ouverture
 */

export const preloadManifest = {
  // Fonts
  fonts: [
    {
      family: "Playfair Display",
      weight: "400",
      style: "normal",
    },
    {
      family: "Inter",
      weight: "400",
      style: "normal",
    },
  ],
  // Images
  images: [
    // L'enveloppe est générée en CSS, pas d'images statiques
  ],
  // Audio
  audio: [
    // Musique de fond (à charger dynamiquement selon les préférences)
  ],
  // Total estimated size
  estimatedSize: 50, // KB (fonts + CSS only, no images)
};
