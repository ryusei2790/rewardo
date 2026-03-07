"use client";

import { useStore } from "@/contexts/AppContext";
import { pickReward, pickTargetCount } from "@/lib/reward";
import { Progress, Reward, RewardPattern } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseProgressReturn {
  progress: Progress;
  pendingReward: Reward | null;
  increment: (rewards: Reward[], patterns: RewardPattern[]) => Promise<void>;
  clearPendingReward: () => void;
}

/** 進捗管理とご褒美発動ロジックを担うカスタムフック */
export function useProgress(): UseProgressReturn {
  const store = useStore();
  const [progress, setProgress] = useState<Progress>({
    done_count: 0,
    target_count: 0,
  });
  const [pendingReward, setPendingReward] = useState<Reward | null>(null);

  useEffect(() => {
    // target_count === 0 は未初期化状態。patterns から初回の target を決定する
    Promise.all([store.getProgress(), store.getPatterns()]).then(
      ([prog, pats]) => {
        if (prog.target_count === 0) {
          const initialTarget = pickTargetCount(pats); // パターン未登録なら5が返る
          const initialized = { done_count: 0, target_count: initialTarget };
          store.updateProgress(initialized);
          setProgress(initialized);
        } else {
          setProgress(prog);
        }
      }
    );
  }, [store]);

  /**
   * done_count を1増やし、target_count に達したらご褒美を発動する。
   * 発動時は done_count をリセットし、次の target_count を抽選する。
   */
  const increment = useCallback(
    async (rewards: Reward[], patterns: RewardPattern[]) => {
      const current = await store.getProgress();
      const newDoneCount = current.done_count + 1;

      if (newDoneCount >= current.target_count) {
        const reward = pickReward(rewards);
        const nextTarget = pickTargetCount(patterns);
        const next: Progress = { done_count: 0, target_count: nextTarget };
        await store.updateProgress(next);
        setProgress(next);
        if (reward) setPendingReward(reward);
      } else {
        const next: Progress = { ...current, done_count: newDoneCount };
        await store.updateProgress(next);
        setProgress(next);
      }
    },
    [store]
  );

  const clearPendingReward = useCallback(() => {
    setPendingReward(null);
  }, []);

  return { progress, pendingReward, increment, clearPendingReward };
}
