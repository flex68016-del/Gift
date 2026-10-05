import { themeRegistry } from "../definitions";
import { preloadManifest } from "./preload";
import { ParchmentScene } from "./scene";

// Enregistre le thème Parchemin
themeRegistry.register({
  key: "parchment",
  name: "Parchemin",
  description: "Thème classique avec sceau de cire et parchemin",
  tokens: {
    colors: {
      primary: "#8E1B1B", // Cire rouge
      secondary: "#B38B3E", // Or terni
      accent: "#2E2118", // Brun encre
      background: "#EBDCBB", // Parchemin
      text: "#2E2118",
      "text-light": "#4A3D32",
    },
    typography: {
      display: "IM Fell English",
      body: "Cormorant Garamond",
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
  OpeningScene: ParchmentScene,
  transitions: {
    type: "fade",
    duration: 600,
  },
});
