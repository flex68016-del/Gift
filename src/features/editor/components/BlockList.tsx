"use client";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/features/blocks/schemas";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

interface BlockListProps {
  blocks: Block[];
  onReorder: (newOrder: Block[]) => void;
  renderBlock: (block: Block, index: number) => React.ReactNode;
}

export function BlockList({ blocks, onReorder, renderBlock }: BlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      onReorder(newBlocks);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <SortableItem key={index} id={index.toString()}>
              <div className="cursor-move">{renderBlock(block, index)}</div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
