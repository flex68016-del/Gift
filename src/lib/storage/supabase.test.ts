import { describe, it, expect } from "vitest";
import { SupabaseStorage } from "./supabase";

describe("SupabaseStorage", () => {
  it("extractBucket extrait le bucket d'un chemin valide", () => {
    const storage = new SupabaseStorage();
    const bucket = (storage as any).extractBucket("gift-assets/test/file.jpg");
    expect(bucket).toBe("gift-assets");
  });

  it("extractPath extrait le chemin d'un chemin valide", () => {
    const storage = new SupabaseStorage();
    const path = (storage as any).extractPath("gift-assets/test/file.jpg");
    expect(path).toBe("test/file.jpg");
  });

  it("extractBucket lance une erreur pour un chemin invalide", () => {
    const storage = new SupabaseStorage();
    expect(() => (storage as any).extractBucket("invalid")).toThrow("Invalid path format");
  });

  it("extractPath lance une erreur pour un chemin invalide", () => {
    const storage = new SupabaseStorage();
    expect(() => (storage as any).extractPath("invalid")).toThrow("Invalid path format");
  });
});
