import { env } from "@/lib/env";

/**
 * Client QStash pour la publication de jobs
 * À implémenter quand QStash sera configuré
 */

interface JobParams {
  name: string;
  payload: Record<string, unknown>;
  idempotencyKey?: string;
  delay?: number; // en secondes
}

export async function publishJob({ name, payload, idempotencyKey, delay }: JobParams): Promise<string> {
  // Pour l'instant, placeholder
  // TODO: Implémenter avec QStash SDK
  console.log(`Publishing job: ${name}`, { payload, idempotencyKey, delay });

  // Exemple d'implémentation future:
  // const client = new Client({ token: env.QSTASH_TOKEN });
  // return await client.publishJSON({
  //   url: `${env.NEXT_PUBLIC_APP_URL}/api/jobs/${name}`,
  //   body: payload,
  //   headers: {
  //     "Idempotency-Key": idempotencyKey,
  //   },
  //   delay: delay ? `${delay}s` : undefined,
  // });

  return "placeholder-job-id";
}
