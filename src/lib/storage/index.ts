import type { StorageProvider, UploadParams } from "./provider";
import { SupabaseStorage, getStorage } from "./supabase";

export { SupabaseStorage, getStorage };
export type { StorageProvider, UploadParams };

// Singleton instance for server-side use
export const storageProvider: StorageProvider = new SupabaseStorage();
