import { NextRequest, NextResponse } from "next/server";
import { hashSecret, verifySecret } from "@/lib/security/hash";
import { signCookie, verifyCookie } from "@/lib/security/cookie";
import { assertSameOrigin } from "@/lib/security/csrf";

interface UnlockRequestBody {
  secret: string;
  turnstileToken?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Vérification CSRF
    assertSameOrigin(request);

    const body: UnlockRequestBody = await request.json();
    const { secret, turnstileToken } = body;

    if (!secret) {
      return NextResponse.json(
        { error: "Secret required" },
        { status: 400 },
      );
    }

    // TODO: Vérifier les limites d'essais avec Upstash
    // 5 essais par 15 minutes par cadeau + IP
    // Après 3 échecs : vérifier Turnstile
    // Après 5 échecs : 429 pendant 15 minutes
    // Pour l'instant, placeholder

    // TODO: Fetch gift from database
    const gift = {
      id: "1",
      slug,
      secretHash: await hashSecret("test123"), // Placeholder
      status: "published",
    };

    // Vérifier que le cadeau existe et est publié
    if (!gift || gift.status !== "published") {
      // Anti-énumération : même temps de réponse
      await new Promise((resolve) => setTimeout(resolve, 100));
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 },
      );
    }

    // Vérifier le mot secret
    const isValid = await verifySecret(secret, gift.secretHash);

    if (!isValid) {
      // TODO: Incrémenter le compteur d'échecs
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 },
      );
    }

    // Créer le cookie signé de déverrouillage (24h)
    const cookieValue = await signCookie(gift.id);

    const response = NextResponse.json({ success: true });

    // Cookie httpOnly, Secure, SameSite=Lax, __Host- prefix
    response.cookies.set({
      name: "__Host-gift-unlock",
      value: cookieValue,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unlock error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
