import { NextRequest } from "next/server";
import { verifyGiftId } from "@/lib/security/cookie";

/**
 * Vérifie que l'utilisateur est le propriétaire du cadeau via le cookie
 */
export function requireGiftOwner(request: NextRequest, giftId: string): void {
  const signedGiftId = request.cookies.get("__Host-gift-draft")?.value;

  if (!signedGiftId) {
    throw new Error("Unauthorized: No gift draft cookie");
  }

  const verifiedGiftId = verifyGiftId(signedGiftId);

  if (!verifiedGiftId || verifiedGiftId !== giftId) {
    throw new Error("Unauthorized: Invalid gift draft cookie");
  }
}
