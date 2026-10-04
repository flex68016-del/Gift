import { createClient } from "@supabase/supabase-js";
import { env } from "../env";
import type { StorageProvider, UploadParams } from "./provider";

/**
 * Implémentation Supabase du provider de stockage
 * Utilise service-role (server-only) pour les permissions complètes
 */
export class SupabaseStorage implements StorageProvider {
  private client;

  constructor() {
    this.client = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || "",
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  async upload(params: UploadParams): Promise<string> {
    const { bucket, path, content, contentType, metadata } = params;

    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, content, {
        contentType,
        upsert: false,
        metadata,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return data.path;
  }

  async download(path: string): Promise<Buffer> {
    const { data, error } = await this.client.storage
      .from(this.extractBucket(path))
      .download(this.extractPath(path));

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    return Buffer.from(await data.arrayBuffer());
  }

  async getSignedUrl(path: string, expiresIn: number): Promise<string> {
    const bucket = this.extractBucket(path);
    const filePath = this.extractPath(path);

    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Signed URL failed: ${error.message}`);
    }

    return data.signedUrl;
  }

  async delete(path: string): Promise<void> {
    const bucket = this.extractBucket(path);
    const filePath = this.extractPath(path);

    const { error } = await this.client.storage.from(bucket).remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async deleteMany(paths: string[]): Promise<void> {
    // Grouper par bucket
    const byBucket = new Map<string, string[]>();
    for (const path of paths) {
      const bucket = this.extractBucket(path);
      const filePath = this.extractPath(path);
      if (!byBucket.has(bucket)) {
        byBucket.set(bucket, []);
      }
      byBucket.get(bucket)!.push(filePath);
    }

    // Supprimer par bucket
    for (const [bucket, filePaths] of byBucket.entries()) {
      const { error } = await this.client.storage.from(bucket).remove(filePaths);
      if (error) {
        throw new Error(`Delete many failed: ${error.message}`);
      }
    }
  }

  private extractBucket(path: string): string {
    const parts = path.split("/");
    if (parts.length < 2) {
      throw new Error(`Invalid path format: ${path}. Expected "bucket/path"`);
    }
    return parts[0] || "";
  }

  private extractPath(path: string): string {
    const parts = path.split("/");
    if (parts.length < 2) {
      throw new Error(`Invalid path format: ${path}. Expected "bucket/path"`);
    }
    return parts.slice(1).join("/");
  }
}

/**
 * Instance singleton du provider Supabase
 */
export const storage = new SupabaseStorage();
