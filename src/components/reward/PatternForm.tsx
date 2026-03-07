"use client";

import { FormEvent, useState } from "react";

interface PatternFormProps {
  onAdd: (min_count: number, max_count: number) => Promise<void>;
}

/** ご褒美パターン登録フォーム */
export function PatternForm({ onAdd }: PatternFormProps) {
  const [min, setMin] = useState(3);
  const [max, setMax] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (min < 1 || max < min) {
      setError("最小値は1以上、最大値は最小値以上にしてください");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onAdd(min, max);
      setMin(3);
      setMax(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-zinc-400">最小</label>
          <input
            type="number"
            min={1}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            disabled={loading}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <span className="text-zinc-500 mt-4">〜</span>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-zinc-400">最大</label>
          <input
            type="number"
            min={1}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            disabled={loading}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 transition-opacity"
      >
        追加
      </button>
    </form>
  );
}
