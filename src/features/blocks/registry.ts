import type { Block, BlockType } from "./schemas";

interface BlockDefinition {
  schema: any;
  defaultConfig: any;
  EditComponent: React.ComponentType<any>;
  RenderComponent: React.ComponentType<any>;
}

// Registre des blocs
const blockRegistry: Record<BlockType, BlockDefinition> = {} as Record<BlockType, BlockDefinition>;

export function registerBlock(type: BlockType, definition: BlockDefinition): void {
  blockRegistry[type] = definition;
}

export function getBlockDefinition(type: BlockType): BlockDefinition | undefined {
  return blockRegistry[type];
}

export function getAllBlockTypes(): BlockType[] {
  return Object.keys(blockRegistry) as BlockType[];
}
