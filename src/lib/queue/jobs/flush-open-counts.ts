import { registerJob } from "../registry";
import { db } from "../../db/client";

interface FlushOpenCountsPayload {
  // Payload vide, exécuté périodiquement
}

async function flushOpenCountsHandler(payload: FlushOpenCountsPayload): Promise<void> {
  try {
    // Appeler la fonction SQL flush_open_counts
    await db`SELECT flush_open_counts()`;
  } catch (error) {
    console.error("Failed to flush open counts:", error);
    throw error;
  }
}

registerJob({
  name: "flush-open-counts",
  handler: (payload: Record<string, unknown>) => flushOpenCountsHandler(payload as unknown as FlushOpenCountsPayload),
  maxRetries: 3,
  retryDelay: 300, // 5 minutes
});
