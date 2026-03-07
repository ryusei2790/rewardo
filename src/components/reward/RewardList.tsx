"use client";

import { Reward } from "@/types";

interface RewardListProps {
  rewards: Reward[];
  onDelete: (id: string) => void;
}

/** ご褒美一覧コンポーネント */
export function RewardList({ rewards, onDelete }: RewardListProps) {
  if (rewards.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-zinc-600">
        ご褒美が登録されていません
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {rewards.map((reward) => (
        <li
          key={reward.id}
          className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
        >
          <div className="flex-1 min-w-0">
            <span className="text-sm text-white truncate block">
              {reward.content}
            </span>
            <span className="text-xs text-zinc-500">
              出現率 {reward.weight}
            </span>
          </div>
          <button
            onClick={() => onDelete(reward.id)}
            className="ml-3 text-zinc-600 hover:text-red-400 transition-colors"
            aria-label="削除"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 1a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1H14a.5.5 0 0 1 0 1h-.5l-.8 9.6a1 1 0 0 1-1 .9H4.3a1 1 0 0 1-1-.9L2.5 3H2a.5.5 0 0 1 0-1h3.5V1zm1 0v1h3V1h-3zM4 3l.8 9h6.4L12 3H4z" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
