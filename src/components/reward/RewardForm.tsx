"use client";

import { FormEvent, useRef, useState } from "react";

interface RewardFormProps {
  onAdd: (content: string, weight: number) => Promise<void>;
}

/** ご褒美登録フォーム */
export function RewardForm({ onAdd }: RewardFormProps) {
  const [content, setContent] = useState("");
  const [weight, setWeight] = useState(5);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      await onAdd(trimmed, weight);
      setContent("");
      setWeight(5);
      setTimeout(() => inputRef.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="ご褒美の内容（例：好きなお菓子を食べる）"
        disabled={loading}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
      />
      <div className="flex items-center gap-3">
        <label className="text-xs text-zinc-400 whitespace-nowrap">
          出現率: {weight}
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="flex-1 accent-white"
        />
        <span className="text-xs text-zinc-500 w-10 text-right">
          {Math.round((weight / 55) * 100)}%
        </span>
      </div>
      <button
        type="submit"
        disabled={!content.trim() || loading}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 transition-opacity"
      >
        追加
      </button>
    </form>
  );
}
