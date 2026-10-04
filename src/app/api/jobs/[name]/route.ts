import { NextRequest, NextResponse } from "next/server";
import { verifyQStashSignature } from "@/lib/queue/verify";
import { getJob } from "@/lib/queue/registry";

export async function POST(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    // Vérifier la signature QStash
    if (!verifyQStashSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const jobName = params.name;
    const job = getJob(jobName);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Lire le payload
    const payload = await request.json();

    // Exécuter le job
    await job.handler(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Job ${params.name} failed:`, error);
    return NextResponse.json({ error: "Job execution failed" }, { status: 500 });
  }
}
