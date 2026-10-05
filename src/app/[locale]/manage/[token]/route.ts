import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { db } from "@/lib/db/client";
import { sha256 } from "@/lib/security/tokens";
import { signCookie } from "@/lib/security/cookie";

interface RouteParams {
  params: {
    locale: string;
    token: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;

    // Hasher le jeton pour comparaison
    const tokenHash = sha256(token);

    // Récupérer le cadeau avec ce jeton d'édition
    const gift = await db`
      SELECT id, slug, edit_token_hash
      FROM gifts
      WHERE edit_token_hash = ${tokenHash}
      LIMIT 1
    `;

    if (!gift || gift.length === 0) {
      // Toujours rediriger vers /manage avec une erreur générique
      // pour éviter l'énumération
      return NextResponse.redirect(
        new URL(`/${params.locale}/manage?error=invalid`, request.url),
      );
    }

    const giftData = gift[0];
    if (!giftData) {
      return NextResponse.redirect(
        new URL(`/${params.locale}/manage?error=invalid`, request.url),
      );
    }

    // Créer le cookie de session avec signature kid pour rotation
    const sessionCookie = await signCookie(giftData.id);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "__Host-manage-session",
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    // Rediriger vers le tableau de bord
    return NextResponse.redirect(
      new URL(`/${params.locale}/manage`, request.url),
    );
  } catch (error) {
    console.error("Manage token exchange error:", error);
    return NextResponse.redirect(
      new URL(`/${params.locale}/manage?error=invalid`, request.url),
    );
  }
}
