import postgres from "postgres";

import { env } from "../env";

// Configuration optimisée pour le pooler Supabase
const client = postgres(env.DATABASE_URL, {
  prepare: false, // Désactive les prepared statements (pooler)
  max: 2, // Pool petit pour le pooler stateless
  idle_timeout: 20, // Timeout idle court
  connection: {
    application_name: "moment-app",
  },
  onnotice: () => {}, // Ignore les notices
});

export type Sql = typeof client;

export const db = client;

/**
 * Ferme proprement la connexion
 */
export async function closeDb(): Promise<void> {
  await client.end();
}
