import { themeRegistry } from "../definitions";
import { GiftRibbonScene } from "./scene";
import { preloadManifest } from "./preload";

// Enregistre le thème Cadeau
themeRegistry.register({
  key: "gift-ribbon",
  name: "Cadeau",
  description: "Thème festif avec boîte cadeau et ruban",
  tokens: {
    colors: {
      primary: "#D9A93F", // Ruban or
      secondary: "#B8283B", // Rouge baie
      accent: "#14382B", // Vert forêt
      background: "#0E1B16", // Nuit
      text: "#F6F1E4", // Ivoire
      "text-light": "#D9A93F",
    },
    typography: {
      display: "Bricolage Grotesque",
      body: "Source Serif 4",
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
  OpeningScene: GiftRibbonScene,
  transitions: {
    type: "fade",
    duration: 500,
  },
});
