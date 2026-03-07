"use client";

import { FormEvent, useRef, useState } from "react";

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<void>;
}

/** タスク追加フォーム */
export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      await onAdd(trimmed);
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクを追加..."
        disabled={loading}
        className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!title.trim() || loading}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 transition-opacity"
      >
        追加
      </button>
    </form>
  );
}
