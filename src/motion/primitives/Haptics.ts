/**
 * Primitif d'animation : haptics (vibration)
 * Garde sur navigator.vibrate et dégrade silencieusement si non supporté
 */

export class Haptics {
  /**
   * Fait vibrer le device
   * @param pattern Durée en ms ou pattern [vibreur, pause, vibreur, ...]
   */
  static vibrate(pattern: number | number[]): void {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Vibration légère (feedback de clic)
   */
  static light(): void {
    this.vibrate(10);
  }

  /**
   * Vibration moyenne (confirmation)
   */
  static medium(): void {
    this.vibrate(20);
  }

  /**
   * Vibration forte (alerte)
   */
  static heavy(): void {
    this.vibrate(40);
  }

  /**
   * Pattern de succès
   */
  static success(): void {
    this.vibrate([50, 50, 50]);
  }

  /**
   * Pattern d'erreur
   */
  static error(): void {
    this.vibrate([100, 50, 100]);
  }

  /**
   * Arrête toute vibration
   */
  static stop(): void {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(0);
    }
  }
}
