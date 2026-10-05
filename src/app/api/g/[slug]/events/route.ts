import { NextRequest, NextResponse } from "next/server";

import { assertBodySize,assertSameOrigin } from "@/lib/security/csrf";

interface EventRequestBody {
  type: "opened" | "completed";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Vérification CSRF
    assertSameOrigin(request);

    // Vérification taille du corps
    assertBodySize(request, 1024);

    const body: EventRequestBody = await request.json();
    const { type } = body;

    if (!type || !["opened", "completed"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 },
      );
    }

    // TODO: Fetch gift from database
    const gift = {
      id: "1",
      slug,
      status: "published",
    };

    if (!gift || gift.status !== "published") {
      return NextResponse.json(
        { error: "Gift not found" },
        { status: 404 },
      );
    }

    // TODO: Enregistrer l'événement dans gift_events
    // Pour "opened", utiliser la fonction SQL record_open
    // Pour "completed", simplement enregistrer

    // TODO: Si c'est la première ouverture, mettre en file l'e-mail
    // job send-email (idempotent)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
