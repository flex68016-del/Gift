import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Limiter le corps à 10 Ko
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10240) {
      return new NextResponse(null, { status: 413 });
    }

    const body = await request.json();

    // Journaliser une seule ligne sans données personnelles
    console.log(
      `CSP Violation: directive=${body["csp-report"]?.["violatedDirective"] || "unknown"} blocked=${body["csp-report"]?.["blockedURL"] || "unknown"}`
    );

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}

export async function GET() {
  return new NextResponse(null, { status: 405, headers: { "Cache-Control": "no-store" } });
}
