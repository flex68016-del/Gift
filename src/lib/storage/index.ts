import type { StorageProvider, UploadParams } from "./provider";
import { SupabaseStorage } from "./supabase";

export { SupabaseStorage };
export type { StorageProvider, UploadParams };

// Singleton instance for server-side use
export const storageProvider: StorageProvider = new SupabaseStorage();
