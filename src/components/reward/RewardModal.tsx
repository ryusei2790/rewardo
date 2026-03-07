"use client";

import { Reward } from "@/types";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface RewardModalProps {
  reward: Reward;
  onClose: () => void;
}

/** ご褒美発動時の confetti + モーダル */
export function RewardModal({ reward, onClose }: RewardModalProps) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFFFFF", "#C9B8FF"],
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div
        className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 p-8 text-center shadow-2xl"
      >
        <div className="mb-4 text-5xl">🎉</div>
        <h2 className="mb-2 text-lg font-semibold text-white">ご褒美ゲット！</h2>
        <p className="mb-6 text-2xl font-bold text-white">{reward.content}</p>
        <button
          onClick={onClose}
          className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          やったー！
        </button>
      </div>
    </div>
  );
}
