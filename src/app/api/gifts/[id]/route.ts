import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, assertBodySize } from "@/lib/security/csrf";
import { limit } from "@/lib/rate-limit";
import { requireGiftOwner } from "@/lib/auth/require-gift-owner";
import { hashSecret } from "@/lib/security/hash";
import { blockSchema } from "@/features/blocks/schemas";

const updateGiftSchema = z
  .object({
    themeKey: z.string().min(1).max(50).optional(),
    locale: z.enum(["fr", "en"]).optional(),
    senderName: z.string().min(1).max(100).optional(),
    blocks: z.array(blockSchema).optional(),
    openSettings: z
      .object({
        type: z.enum(["immediate", "secret", "scheduled"]),
        secret: z.string().optional(),
        hint: z.string().max(200).optional(),
        scheduledAt: z.string().optional(), // ISO 8601 UTC
      })
      .optional(),
  })
  .strict();

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const giftId = params.id;

    // Vérifications de sécurité
    assertSameOrigin(request);
    assertBodySize(request);

    // Authentification du propriétaire
    requireGiftOwner(request, giftId);

    // Rate limiting
    const deviceCookie = request.cookies.get("__Host-did")?.value;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const limitResult = await limit({
      route: "PATCH /api/gifts/[id]",
      device: deviceCookie,
      resource: `update-gift-${giftId}`,
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
    const result = updateGiftSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { themeKey, locale, senderName, blocks, openSettings } = result.data;

    // Validation des blocs avec validateGift
    if (blocks) {
      const { validateGift } = await import("@/features/blocks/schemas");
      const validation = validateGift(blocks);

      if (!validation.valid) {
        return NextResponse.json({ error: "Invalid blocks", details: validation.errors }, { status: 400 });
      }
    }

    // Traitement des réglages d'ouverture
    let openSettingsData = null;
    if (openSettings) {
      if (openSettings.type === "secret" && openSettings.secret) {
        const secretHash = await hashSecret(openSettings.secret);
        openSettingsData = {
          type: "secret",
          secretHash,
          hint: openSettings.hint,
        };
      } else if (openSettings.type === "scheduled" && openSettings.scheduledAt) {
        openSettingsData = {
          type: "scheduled",
          scheduledAt: new Date(openSettings.scheduledAt).toISOString(),
        };
      } else {
        openSettingsData = {
          type: "immediate",
        };
      }
    }

    // Mise à jour en base de données
    // TODO: Implémenter la mise à jour dans Supabase avec transaction
    // await db.update("gifts", { id: giftId }, { themeKey, locale, senderName, blocks, openSettings: openSettingsData });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Error updating gift:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
