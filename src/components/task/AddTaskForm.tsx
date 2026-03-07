"use client";

import { FormEvent, useRef, useState } from "react";

type Mode = "single" | "bulk";

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<void>;
  onAddBulk: (titles: string[]) => Promise<void>;
}

/** タスク追加フォーム（1件追加 / まとめて追加のタブ切り替え対応） */
export function AddTaskForm({ onAdd, onAddBulk }: AddTaskFormProps) {
  const [mode, setMode] = useState<Mode>("single");
  const [title, setTitle] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
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

  const handleBulkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const titles = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (titles.length === 0 || loading) return;

    setLoading(true);
    try {
      await onAddBulk(titles);
      setBulkText("");
      setFeedback(`${titles.length}件のタスクを追加しました`);
    } catch {
      setFeedback("追加に失敗しました。再度お試しください。");
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div>
      {/* タブ */}
      <div className="flex border-b border-zinc-700 mb-3">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`px-3 py-1.5 text-sm transition-colors ${
            mode === "single"
              ? "border-b-2 border-white text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          1件追加
        </button>
        <button
          type="button"
          onClick={() => setMode("bulk")}
          className={`px-3 py-1.5 text-sm transition-colors ${
            mode === "bulk"
              ? "border-b-2 border-white text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          まとめて追加
        </button>
      </div>

      {mode === "single" ? (
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
      ) : (
        <form onSubmit={handleBulkSubmit} className="flex flex-col gap-2">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"タスクを1行ずつ入力...\n例：\n朝のジョギング\n読書30分\n報告書を書く"}
            rows={6}
            disabled={loading}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none resize-y"
          />
          {feedback && (
            <p className="text-xs text-emerald-400">{feedback}</p>
          )}
          <button
            type="submit"
            disabled={!bulkText.trim() || loading}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 transition-opacity"
          >
            {loading ? "追加中..." : "まとめて追加"}
          </button>
        </form>
      )}
    </div>
  );
}
