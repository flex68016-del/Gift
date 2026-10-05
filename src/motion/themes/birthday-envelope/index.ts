import { themeRegistry } from "../definitions";
import { preloadManifest } from "./preload";
import { BirthdayEnvelopeScene } from "./scene";

// Enregistre le thème anniversaire
themeRegistry.register({
  key: "birthday",
  name: "Anniversaire",
  description: "Thème festif avec scène d'enveloppe interactive",
  tokens: {
    colors: {
      primary: "#FF6B6B",
      secondary: "#FFE66D",
      accent: "#4ECDC4",
      background: "#FFF5F5",
      text: "#2D3436",
      "text-light": "#636E72",
    },
    typography: {
      display: "Playfair Display",
      body: "Inter",
    },
    spacing: {
      sm: "0.5rem",
      md: "1rem",
      lg: "2rem",
      xl: "4rem",
    },
  },
  preload: {
    critical: [], // CSS généré dynamiquement, pas d'assets statiques critiques (~50KB estimé)
    deferred: [], // Pas d'images statiques
  },
  OpeningScene: BirthdayEnvelopeScene,
  transitions: {
    type: "fade",
    duration: 500,
  },
});
