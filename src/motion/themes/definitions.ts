import type { Block } from "@/features/blocks/schemas";

export interface ThemeDefinition {
  key: string;
  name: string;
  description: string;
  // Configuration des jetons spécifiques au thème
  tokens: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    spacing: Record<string, string>;
  };
  // Assets à précharger
  preload: {
    critical: string[]; // ≤ 150 Ko
    deferred: string[];
  };
  // Composant de scène d'ouverture
  OpeningScene: React.ComponentType<{
    onOpen: () => void;
    onSkip: () => void;
    tier: "lite" | "standard" | "ultra";
  }>;
  // Configuration des transitions entre blocs
  transitions: {
    type: "fade" | "slide" | "scale";
    duration: number;
  };
}

export interface ThemeRegistry {
  get(key: string): ThemeDefinition | undefined;
  getAll(): ThemeDefinition[];
  register(theme: ThemeDefinition): void;
}

const themes = new Map<string, ThemeDefinition>();

export const themeRegistry: ThemeRegistry = {
  get(key: string) {
    return themes.get(key);
  },
  getAll() {
    return Array.from(themes.values());
  },
  register(theme: ThemeDefinition) {
    themes.set(theme.key, theme);
  },
};
