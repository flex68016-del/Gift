/**
 * Enveloppe autour de GSAP pour les scènes animées
 * Gère le nettoyage au démontage et le mode économie
 */

type GSAPTimeline = {
  kill: () => void;
  to: (target: any, props: any) => any;
  from: (target: any, props: any) => any;
  fromTo: (target: any, fromProps: any, toProps: any) => any;
  add: (callback: () => void, position?: string) => any;
};

export class SceneDirector {
  public timeline: GSAPTimeline | null = null;
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
  async createTimeline(): Promise<GSAPTimeline | null> {
    if (this.prefersReducedMotion) {
      return null; // Pas d'animation si prefers-reduced-motion
    }

    const gsapModule = await import("gsap");
    this.timeline = (gsapModule as any).timeline();
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
   * Annule la timeline
   */
  cancel(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
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
