import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/lib/env";
import { limit } from "@/lib/rate-limit";
import { signGiftId } from "@/lib/security/cookie";
import { assertBodySize,assertSameOrigin } from "@/lib/security/csrf";
import { generateDeviceId } from "@/lib/security/device-id";
import { generateEditToken, generateSlug, sha256 } from "@/lib/security/tokens";

const createGiftSchema = z.object({
  themeKey: z.string().min(1).max(50),
  locale: z.enum(["fr", "en"]),
  senderName: z.string().min(1).max(100),
  turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Vérifications de sécurité
    assertSameOrigin(request);
    assertBodySize(request);

    // Rate limiting
    const deviceCookie = request.cookies.get("__Host-did")?.value;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
    const limitResult = await limit({
      route: "POST /api/gifts",
      device: deviceCookie,
      resource: "create-gift",
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
    const result = createGiftSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { themeKey, locale, senderName, turnstileToken } = result.data;

    // Vérification Turnstile
    if (turnstileToken) {
      // TODO: Implémenter la vérification Turnstile avec siteverify
      // const turnstileValid = await verifyTurnstile(turnstileToken, "create-gift");
      // if (!turnstileValid) {
      //   return NextResponse.json({ error: "Invalid Turnstile token" }, { status: 400 });
      // }
    }

    // Génération des identifiants
    const slug = generateSlug();
    const editToken = generateEditToken();
    const editTokenHash = sha256(editToken);

    // Création du brouillon en base de données
    // TODO: Implémenter l'insertion dans Supabase
    const giftId = "placeholder-id"; // Remplacer par l'ID réel

    // Signer l'identifiant pour le cookie
    const signedGiftId = signGiftId(giftId);

    // Créer la réponse avec le cookie
    const giftResponse = NextResponse.json(
      {
        giftId,
        slug,
        editToken, // Renvoyer le token au client pour le stockage temporaire
      },
      { status: 201 },
    );

    // Cookie sécurisé pour identifier le propriétaire du brouillon
    giftResponse.cookies.set("__Host-gift-draft", signedGiftId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60, // 14 jours
    });

    // Cookie d'appareil s'il n'existait pas
    if (!deviceCookie) {
      const deviceId = generateDeviceId();
      giftResponse.cookies.set("__Host-did", deviceId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 90 * 24 * 60 * 60, // 90 jours
      });
    }

    return giftResponse;
  } catch (error) {
    console.error("Error creating gift:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
