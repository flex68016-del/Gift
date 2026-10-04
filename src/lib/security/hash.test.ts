import { describe, expect,it } from "vitest";

import { dummyHash,hashSecret, verifySecret } from "./hash";

describe("hashSecret", () => {
  it("génère un hash avec un sel", () => {
    const hash = hashSecret("test-secret");
    expect(hash).toContain(":");
    const [salt, hashed] = hash.split(":");
    expect(salt).toHaveLength(64);
    expect(hashed).toHaveLength(128);
  });

  it("génère des hashes différents pour le même secret", () => {
    const hash1 = hashSecret("test-secret");
    const hash2 = hashSecret("test-secret");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifySecret", () => {
  it("vérifie correctement un secret valide", () => {
    const hash = hashSecret("test-secret");
    expect(verifySecret("test-secret", hash)).toBe(true);
  });

  it("rejette un secret invalide", () => {
    const hash = hashSecret("test-secret");
    expect(verifySecret("wrong-secret", hash)).toBe(false);
  });

  it("rejette un hash mal formaté", () => {
    expect(verifySecret("test", "invalid")).toBe(false);
  });
});

describe("dummyHash", () => {
  it("génère un hash dummy pour égalisation de temps", () => {
    const hash = dummyHash();
    expect(hash).toBeTruthy();
    expect(hash.length).toBeGreaterThan(0);
  });
});
