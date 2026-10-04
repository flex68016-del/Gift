/**
 * Moteur audio pour la gestion de la musique et des sons
 * Crée l'AudioContext au premier geste utilisateur
 */

export class AudioEngine {
  private context: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isInitialized = false;

  /**
   * Initialise l'AudioContext (doit être appelé après un geste utilisateur)
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;

      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.context.destination);

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
    }
  }

  /**
   * Joue un fichier audio depuis une URL
   */
  async play(url: string): Promise<void> {
    if (!this.context) {
      await this.init();
    }

    if (!this.context) {
      throw new Error("AudioContext not initialized");
    }

    // Arrêter la lecture en cours
    this.stop();

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      this.currentSource = this.context.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      this.currentSource.connect(this.gainNode!);
      this.currentSource.start(0);
    } catch (error) {
      console.error("Failed to play audio:", error);
      throw error;
    }
  }

  /**
   * Met en pause la lecture
   */
  pause(): void {
    if (this.context && this.context.state === "running") {
      this.context.suspend();
    }
  }

  /**
   * Reprend la lecture
   */
  resume(): void {
    if (this.context && this.context.state === "suspended") {
      this.context.resume();
    }
  }

  /**
   * Arrête la lecture
   */
  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (error) {
        // Ignore si déjà arrêté
      }
      this.currentSource = null;
    }
  }

  /**
   * Règle le volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Coupe le son (mute)
   */
  mute(): void {
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }

  /**
   * Réactive le son (unmute)
   */
  unmute(): void {
    if (this.gainNode) {
      this.gainNode.gain.value = 1;
    }
  }

  /**
   * Obtient les données de l'analyseur (pour la visualisation)
   */
  getAnalyserData(dataArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray);
    }
  }

  /**
   * Nettoie les ressources
   */
  destroy(): void {
    this.stop();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.gainNode = null;
    this.analyser = null;
    this.isInitialized = false;
  }
}

/**
 * Instance singleton
 */
export const audioEngine = new AudioEngine();
