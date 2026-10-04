import { themeRegistry } from "../definitions";
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
    critical: [], // Pas d'assets critiques pour l'instant
    deferred: [], // Assets différés à définir
  },
  OpeningScene: BirthdayEnvelopeScene,
  transitions: {
    type: "fade",
    duration: 500,
  },
});
