import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { generateSlug } from "@/lib/security/tokens";
import { hmac } from "./hmac";

/**
 * Génère et signe un identifiant d'appareil pour le rate limiting
 */
export function generateDeviceId(): string {
  const deviceId = generateSlug(32); // 128 bits en hex
  const timestamp = Date.now().toString();
  const data = `${deviceId}:${timestamp}`;
  const signature = hmac(data, env.SESSION_SECRET);
  return `${data}:${signature}`;
}

/**
 * Vérifie un identifiant d'appareil signé
 */
export function verifyDeviceId(signedData: string): string | null {
  const parts = signedData.split(":");
  if (parts.length !== 3) return null;

  const [deviceId, timestamp, signature] = parts;

  // Vérifier la signature
  const data = `${deviceId}:${timestamp}`;
  const expectedSignature = hmac(data, env.SESSION_SECRET);

  if (signature !== expectedSignature) return null;

  // Vérifier que le cookie n'est pas trop vieux (90 jours)
  const cookieTime = parseInt(timestamp, 10);
  const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 jours en ms
  if (Date.now() - cookieTime > maxAge) return null;

  return deviceId;
}

/**
 * Middleware pour s'assurer que le cookie d'appareil existe
 */
export function ensureDeviceCookie(request: NextRequest, response: NextResponse): void {
  const existingCookie = request.cookies.get("__Host-did");

  if (!existingCookie) {
    const deviceId = generateDeviceId();
    response.cookies.set("__Host-did", deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 90 * 24 * 60 * 60, // 90 jours
    });
  }
}
