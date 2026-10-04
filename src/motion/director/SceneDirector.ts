/**
 * Enveloppe autour de GSAP pour les scènes animées
 * Gère le nettoyage au démontage et le mode économie
 */

export class SceneDirector {
  private timeline: any = null;
  private cleanupCallbacks: Array<() => void> = [];
  private prefersReducedMotion = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
  }

  /**
   * Crée une nouvelle timeline GSAP
   * GSAP est importé dynamiquement pour éviter le chemin critique
   */
  async createTimeline(): Promise<any> {
    if (this.prefersReducedMotion) {
      return null; // Pas d'animation si prefers-reduced-motion
    }

    const gsap = await import("gsap");
    this.timeline = gsap.timeline();
    return this.timeline;
  }

  /**
   * Enregistre une fonction de nettoyage
   */
  onCleanup(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  /**
   * Nettoie toutes les ressources
   */
  destroy(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    for (const callback of this.cleanupCallbacks) {
      callback();
    }

    this.cleanupCallbacks = [];
  }

  /**
   * Vérifie si les animations sont activées
   */
  isAnimationEnabled(): boolean {
    return !this.prefersReducedMotion;
  }
}

/**
 * Hook React pour utiliser SceneDirector
 */
export function useSceneDirector() {
  const director = new SceneDirector();

  // Cleanup automatique au démontage
  if (typeof window !== "undefined") {
    (window as any).__sceneDirector = director;
  }

  return director;
}
