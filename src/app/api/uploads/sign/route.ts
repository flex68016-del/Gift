import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireGiftOwner } from "@/lib/auth/require-gift-owner";
import { env } from "@/lib/env";
import { limit } from "@/lib/rate-limit";
import { assertBodySize,assertSameOrigin } from "@/lib/security/csrf";
import { getStorage } from "@/lib/storage";

const signUploadSchema = z.object({
  giftId: z.string(),
  type: z.enum(["image", "audio"]),
  filename: z.string(),
  contentType: z.string(),
  size: z.number().max(25 * 1024 * 1024), // 25 Mo max
});

const QUOTAS = {
  image: { max: 10, maxSize: 25 * 1024 * 1024 }, // 10 images, 25 Mo par cadeau
  audio: { max: 3, maxSize: 25 * 1024 * 1024 }, // 3 audios, 25 Mo par cadeau
};

export async function POST(request: NextRequest) {
  try {
    // Vérifications de sécurité
    assertSameOrigin(request);
    assertBodySize(request);

    // Rate limiting
    const deviceCookie = request.cookies.get("__Host-did")?.value;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const limitResult = await limit({
      route: "POST /api/uploads/sign",
      device: deviceCookie,
      resource: "upload-sign",
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
    const result = signUploadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { giftId, type, filename, size } = result.data;

    // Authentification du propriétaire
    requireGiftOwner(request, giftId);

    // Vérification des quotas
    // TODO: Implémenter la vérification des quotas en base de données
    // const currentCount = await db.count("assets", { gift_id: giftId, type });
    // const quota = QUOTAS[type];
    // if (currentCount >= quota.max) {
    //   return NextResponse.json({ error: `Maximum ${quota.max} ${type}s allowed` }, { status: 400 });
    // }

    // Génération de l'ID d'asset
    const assetId = crypto.randomUUID();
    const ext = filename.split(".").pop() || type === "image" ? "webp" : "webm";
    const path = `${giftId}/${assetId}.${ext}`;

    // Génération de l'URL signée
    const storage = getStorage();
    const signedUrl = await storage.getSignedUploadUrl(path, type, 600); // 10 minutes

    return NextResponse.json({
      assetId,
      path,
      signedUrl,
      maxUploadSize: QUOTAS[type].maxSize,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Error signing upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
