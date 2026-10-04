/**
 * Interface du provider de stockage
 * Permet de changer de backend (Supabase → R2) sans changer le code métier
 */
export interface StorageProvider {
  /**
   * Uploade un fichier
   */
  upload(params: UploadParams): Promise<string>;

  /**
   * Télécharge un fichier
   */
  download(path: string): Promise<Buffer>;

  /**
   * Génère une URL signée temporaire
   */
  getSignedUrl(path: string, expiresIn: number): Promise<string>;

  /**
   * Génère une URL signée pour l'upload
   */
  getSignedUploadUrl(path: string, type: string, expiresIn: number): Promise<string>;

  /**
   * Supprime un fichier
   */
  delete(path: string): Promise<void>;

  /**
   * Supprime plusieurs fichiers
   */
  deleteMany(paths: string[]): Promise<void>;
}

export interface UploadParams {
  bucket: string;
  path: string;
  content: Buffer;
  contentType: string;
  metadata?: Record<string, string>;
}
