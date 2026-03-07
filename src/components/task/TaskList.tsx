"use client";

import { DoneTaskItem, TaskItem } from "@/components/task/TaskItem";
import { Task } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

/** タスク一覧（ドラッグ並び替え対応） */
export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onReorder,
}: TaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const pending = tasks.filter((t) => !t.is_done);
  const done = tasks.filter((t) => t.is_done);

  const handleDragStart = (event: DragStartEvent) => {
    const task = pending.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pending.findIndex((t) => t.id === active.id);
    const newIndex = pending.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(pending, oldIndex, newIndex);
    await onReorder(reordered.map((t) => t.id));
  };

  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-600">
        タスクを追加してみましょう
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pending.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {pending.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <div className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 shadow-xl opacity-90">
              <span className="text-sm text-white">{activeTask.title}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {done.length > 0 && (
        <>
          <div className="my-1 flex items-center gap-2">
            <hr className="flex-1 border-zinc-800" />
            <span className="text-xs text-zinc-600">完了済み</span>
            <hr className="flex-1 border-zinc-800" />
          </div>
          {done.map((task) => (
            <DoneTaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}
