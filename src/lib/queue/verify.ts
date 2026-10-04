import { env } from "@/lib/env";
import { hmac } from "@/lib/security/hmac";

/**
 * Vérifie la signature d'une requête QStash
 * Utilise les clés courante et suivante pour la rotation
 */
export function verifyQStashSignature(request: Request): boolean {
  const signature = request.headers.get("Upstash-Signature");
  const body = request.headers.get("Upstash-Signing-Key") || "";

  if (!signature) {
    return false;
  }

  // La signature QStash est au format: t=timestamp,v1=signature
  const parts = signature.split(",");
  const signaturePart = parts.find((p) => p.startsWith("v1="));

  if (!signaturePart) {
    return false;
  }

  const receivedSignature = signaturePart.substring(3);

  // Vérifier avec la clé courante
  const expectedSignatureCurrent = hmac(body, env.QSTASH_CURRENT_SIGNING_KEY);
  if (receivedSignature === expectedSignatureCurrent) {
    return true;
  }

  // Vérifier avec la clé suivante (rotation)
  const expectedSignatureNext = hmac(body, env.QSTASH_NEXT_SIGNING_KEY);
  if (receivedSignature === expectedSignatureNext) {
    return true;
  }

  return false;
}
