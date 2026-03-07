"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDone?: boolean;
}

/** ドラッグ可能な単一タスク行コンポーネント */
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
    >
      {/* ドラッグハンドル */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-zinc-600 hover:text-zinc-400 active:cursor-grabbing"
        aria-label="ドラッグで並び替え"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <circle cx="5" cy="4" r="1.5" />
          <circle cx="11" cy="4" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="11" cy="12" r="1.5" />
        </svg>
      </button>

      {/* チェックボックス */}
      <input
        type="checkbox"
        checked={task.is_done}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 cursor-pointer accent-white"
      />

      {/* タイトル */}
      <span
        className={`flex-1 text-sm ${
          task.is_done ? "text-zinc-500 line-through" : "text-white"
        }`}
      >
        {task.title}
      </span>

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-zinc-600 hover:text-red-400 transition-colors"
        aria-label="タスクを削除"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 1a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1H14a.5.5 0 0 1 0 1h-.5l-.8 9.6a1 1 0 0 1-1 .9H4.3a1 1 0 0 1-1-.9L2.5 3H2a.5.5 0 0 1 0-1h3.5V1zm1 0v1h3V1h-3zM4 3l.8 9h6.4L12 3H4z" />
        </svg>
      </button>
    </div>
  );
}

/** 完了済みタスク（ドラッグ不可・薄表示） */
export function DoneTaskItem({
  task,
  onToggle,
  onDelete,
}: Omit<TaskItemProps, "isDone">) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-zinc-800/50 bg-zinc-900/50 px-3 py-2 opacity-50">
      <span className="w-4" />
      <input
        type="checkbox"
        checked={task.is_done}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 cursor-pointer accent-white"
      />
      <span className="flex-1 text-sm text-zinc-500 line-through">
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-zinc-700 hover:text-red-400 transition-colors"
        aria-label="タスクを削除"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 1a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1H14a.5.5 0 0 1 0 1h-.5l-.8 9.6a1 1 0 0 1-1 .9H4.3a1 1 0 0 1-1-.9L2.5 3H2a.5.5 0 0 1 0-1h3.5V1zm1 0v1h3V1h-3zM4 3l.8 9h6.4L12 3H4z" />
        </svg>
      </button>
    </div>
  );
}
