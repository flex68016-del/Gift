import sharp from "sharp";

import { getStorage } from "@/lib/storage";

import { registerJob } from "../registry";

interface ProcessImagePayload {
  assetId: string;
  path: string;
  type: "image" | "audio";
}

async function processImageHandler(payload: ProcessImagePayload): Promise<void> {
  const { assetId, path, type } = payload;

  if (type !== "image") {
    // Pour l'audio, juste vérifier la durée
    // TODO: Implémenter la vérification de durée audio
    console.log(`Audio processing for asset ${assetId}`);
    return;
  }

  try {
    const storage = getStorage();

    // Télécharger l'image originale
    const originalBuffer = await storage.download(path);

    if (!originalBuffer) {
      throw new Error("Original image not found");
    }

    // Traitement avec sharp
    const processedImage = await sharp(originalBuffer, { limitInputPixels: 67108864 }) // Max 64 MP pour éviter DoS
      .webp({ quality: 80 }) // Conversion en WebP
      .rotate() // Auto-rotation basée sur EXIF
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true }) // Max 1600px
      .toBuffer();

    // Créer la miniature (480px max)
    const thumbnail = await sharp(originalBuffer)
      .webp({ quality: 70 })
      .rotate()
      .resize(480, 480, { fit: "inside", withoutEnlargement: true })
      .toBuffer();

    // Supprimer les métadonnées EXIF/GPS (sharp le fait automatiquement)
    // Les données de localisation sont supprimées

    // Chemins
    const bucket = "gifts"; // TODO: Configurer le bucket
    const processedPath = `${path.split("/")[0]}/${assetId}_processed.webp`;
    const thumbnailPath = `${path.split("/")[0]}/${assetId}_thumb.webp`;

    // Uploader les versions traitées
    await storage.upload({
      bucket,
      path: processedPath,
      content: processedImage,
      contentType: "image/webp",
    });

    await storage.upload({
      bucket,
      path: thumbnailPath,
      content: thumbnail,
      contentType: "image/webp",
    });

    // Supprimer l'original
    await storage.delete(path);

    // TODO: Mettre à jour le statut en base de données
    console.log(`Image processed for asset ${assetId}`);
  } catch (error) {
    console.error(`Failed to process image ${assetId}:`, error);
    throw error;
  }
}

registerJob({
  name: "process-image",
  handler: (payload: Record<string, unknown>) => processImageHandler(payload as unknown as ProcessImagePayload),
  maxRetries: 3,
  retryDelay: 60, // 1 minute
});
