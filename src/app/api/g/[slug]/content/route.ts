import { NextRequest, NextResponse } from "next/server";
import { verifyCookie } from "@/lib/security/cookie";
import { assertSameOrigin } from "@/lib/security/csrf";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    // Vérification CSRF
    assertSameOrigin(request);

    // Vérifier le cookie de déverrouillage
    const unlockCookie = request.cookies.get("__Host-gift-unlock");
    if (!unlockCookie) {
      return NextResponse.json(
        { error: "Not unlocked" },
        { status: 403 },
      );
    }

    const giftId = await verifyCookie(unlockCookie.value);
    if (!giftId) {
      return NextResponse.json(
        { error: "Invalid unlock token" },
        { status: 403 },
      );
    }

    // TODO: Fetch gift from database
    const gift = {
      id: giftId,
      slug: params.slug,
      status: "published",
      openSettings: {
        type: "immediate",
        scheduledAt: null,
      },
      blocks: [],
      themeKey: "birthday",
    };

    // Vérifier que le cadeau existe et est publié
    if (!gift || gift.status !== "published") {
      return NextResponse.json(
        { error: "Gift not found" },
        { status: 404 },
      );
    }

    // Vérifier si le cadeau est planifié et non échu
    if (gift.openSettings.type === "scheduled" && gift.openSettings.scheduledAt) {
      const scheduledDate = new Date(gift.openSettings.scheduledAt);
      const now = new Date();

      if (now < scheduledDate) {
        // Retourner 423 avec Retry-After
        const retryAfter = Math.floor((scheduledDate.getTime() - now.getTime()) / 1000);
        return NextResponse.json(
          { error: "Not yet available" },
          {
            status: 423,
            headers: {
              "Retry-After": retryAfter.toString(),
            },
          },
        );
      }
    }

    // TODO: Générer des URL signées pour les fichiers (15 min)
    // Pour l'instant, retourner les blocs sans URLs
    const response = NextResponse.json({
      gift: {
        id: gift.id,
        themeKey: gift.themeKey,
        openSettings: gift.openSettings,
        blocks: gift.blocks,
      },
      // TODO: Ajouter signedUrls quand le stockage est implémenté
      signedUrls: {},
    });

    // Cache-Control: no-store pour éviter la mise en cache
    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Content error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
