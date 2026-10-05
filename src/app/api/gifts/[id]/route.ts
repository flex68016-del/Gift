import { NextRequest, NextResponse } from "next/server";

import { verifyCookie } from "@/lib/security/cookie";
import { assertSameOrigin } from "@/lib/security/csrf";
import { db } from "@/lib/db/client";
import { invalidateAllGiftCaches } from "@/lib/cache";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Vérification CSRF
    assertSameOrigin(request);

    // Vérifier le cookie de session
    const sessionCookie = request.cookies.get("__Host-manage-session");
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const giftId = await verifyCookie(sessionCookie.value);
    if (!giftId || giftId !== params.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Suppression logique (marquer comme supprimé)
    await db`
      UPDATE gifts
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = ${giftId}
    `;

    // Invalider le cache
    await invalidateAllGiftCaches(giftId, "");

    // TODO: Envoyer un e-mail de notification à l'expéditeur

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete gift error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
