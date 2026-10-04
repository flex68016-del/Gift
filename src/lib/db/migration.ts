import postgres from "postgres";
import { env } from "../env";

/**
 * Client pour les migrations avec timeout plus long
 */
export const migrationClient = postgres(env.DATABASE_MIGRATION_URL || env.DATABASE_URL, {
  max: 1,
  prepare: false,
  idle_timeout: 60,
  connection: {
    application_name: "moment-migration",
  },
});

export async function closeMigrationDb(): Promise<void> {
  await migrationClient.end();
}
