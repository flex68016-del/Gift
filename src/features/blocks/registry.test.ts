import { describe, expect,it } from "vitest";

import { getAllBlockTypes,getBlockDefinition, registerBlock } from "./registry";

describe("blockRegistry", () => {
  it("retourne undefined pour un type non enregistré", () => {
    expect(getBlockDefinition("unknown" as any)).toBeUndefined();
  });

  it("retourne la définition pour un type enregistré", () => {
    registerBlock("letter" as any, {
      schema: {},
      defaultConfig: {},
      EditComponent: () => null,
      RenderComponent: () => null,
    });
    const def = getBlockDefinition("letter" as any);
    expect(def).toBeDefined();
  });

  it("liste tous les types enregistrés", () => {
    registerBlock("test" as any, {
      schema: {},
      defaultConfig: {},
      EditComponent: () => null,
      RenderComponent: () => null,
    });
    const types = getAllBlockTypes();
    expect(types).toContain("test");
  });
});
