import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin, assertBodySize } from "@/lib/security/csrf";

interface ReportRequestBody {
  reason: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    // Vérification CSRF
    assertSameOrigin(request);

    // Vérification taille du corps
    assertBodySize(request, 1024);

    const body: ReportRequestBody = await request.json();
    const { reason } = body;

    if (!reason || reason.length > 500) {
      return NextResponse.json(
        { error: "Invalid reason" },
        { status: 400 },
      );
    }

    // TODO: Fetch gift from database
    const gift = {
      id: "1",
      slug: params.slug,
      status: "published",
    };

    if (!gift || gift.status !== "published") {
      return NextResponse.json(
        { error: "Gift not found" },
        { status: 404 },
      );
    }

    // TODO: Insérer dans abuse_reports
    // gift_id, reason, created_at
    // Limiter en débit (Upstash)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
