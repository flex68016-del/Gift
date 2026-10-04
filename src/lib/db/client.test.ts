import { describe, it, expect } from "vitest";
import { db, closeDb } from "./client";

describe("db client", () => {
  it("exporte le client postgres", () => {
    expect(db).toBeDefined();
    expect(typeof db).toBe("object");
  });

  it("closeDb est une fonction", () => {
    expect(typeof closeDb).toBe("function");
  });
});
