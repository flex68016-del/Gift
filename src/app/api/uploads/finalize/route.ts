import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireGiftOwner } from "@/lib/auth/require-gift-owner";
import { limit } from "@/lib/rate-limit";
import { assertBodySize,assertSameOrigin } from "@/lib/security/csrf";
import { storage } from "@/lib/storage";

const finalizeUploadSchema = z.object({
  giftId: z.string(),
  assetId: z.string(),
  path: z.string(),
  type: z.enum(["image", "audio"]),
  size: z.number(),
});

// Magic numbers pour détecter le type de fichier
const MAGIC_NUMBERS = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46],
  webm: [0x1a, 0x45, 0xdf, 0xa3],
  ogg: [0x4f, 0x67, 0x67, 0x53],
  mp4: [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70], // mp4/m4a
};

function detectFileType(buffer: Buffer): string | null {
  const bytes = Array.from(buffer.slice(0, 4));

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return "webp";
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "webm";
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) return "ogg";
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "mp4";

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Vérifications de sécurité
    assertSameOrigin(request);
    assertBodySize(request);

    // Rate limiting
    const deviceCookie = request.cookies.get("__Host-did")?.value;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const limitResult = await limit({
      route: "POST /api/uploads/finalize",
      device: deviceCookie,
      resource: "upload-finalize",
      ip,
    });

    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": limitResult.resetAt ? Math.ceil((limitResult.resetAt - Date.now()) / 1000).toString() : "60" } },
      );
    }

    // Validation du corps
    const body = await request.json();
    const result = finalizeUploadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { giftId, assetId, path, type, size } = result.data;

    // Authentification du propriétaire
    requireGiftOwner(request, giftId);

    // Télécharger le fichier pour vérification
    const fileBuffer = await storage().download(path);

    if (!fileBuffer) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Vérifier la taille réelle
    if (fileBuffer.length !== size) {
      // Supprimer le fichier
      await storage().delete(path);
      return NextResponse.json({ error: "Size mismatch" }, { status: 400 });
    }

    // Détecter le type réel
    const detectedType = detectFileType(fileBuffer);

    if (!detectedType) {
      await storage().delete(path);
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Valider le type
    const allowedImageTypes = ["jpeg", "png", "webp"];
    const allowedAudioTypes = ["webm", "ogg", "mp4"];

    if (type === "image" && !allowedImageTypes.includes(detectedType)) {
      await storage().delete(path);
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }

    if (type === "audio" && !allowedAudioTypes.includes(detectedType)) {
      await storage().delete(path);
      return NextResponse.json({ error: "Invalid audio type" }, { status: 400 });
    }

    // SVG refusé (vectorielle, peut contenir du code)
    if (detectedType === "svg") {
      await storage().delete(path);
      return NextResponse.json({ error: "SVG not allowed" }, { status: 400 });
    }

    // Mettre en file le job de traitement
    // TODO: Implémenter la mise en file avec QStash
    // await queueClient.publish("process-image", { assetId, path, type });

    // Pour l'instant, on simule le traitement
    // TODO: Remplacer par la vraie mise en file
    console.log(`Queuing job: process-image for asset ${assetId}`);

    return NextResponse.json({
      assetId,
      status: "processing",
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Error finalizing upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
