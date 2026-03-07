"use client";

import { useStore } from "@/contexts/AppContext";
import { Reward, RewardPattern } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseRewardsReturn {
  rewards: Reward[];
  patterns: RewardPattern[];
  loading: boolean;
  addReward: (content: string, weight: number) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  addPattern: (min_count: number, max_count: number) => Promise<void>;
  deletePattern: (id: string) => Promise<void>;
}

/** ご褒美とパターンの CRUD を管理するカスタムフック */
export function useRewards(): UseRewardsReturn {
  const store = useStore();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [patterns, setPatterns] = useState<RewardPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([store.getRewards(), store.getPatterns()])
      .then(([r, p]) => {
        setRewards(r);
        setPatterns(p);
      })
      .finally(() => setLoading(false));
  }, [store]);

  const addReward = useCallback(
    async (content: string, weight: number) => {
      const reward = await store.addReward(content, weight);
      setRewards((prev) => [...prev, reward]);
    },
    [store]
  );

  const deleteReward = useCallback(
    async (id: string) => {
      await store.deleteReward(id);
      setRewards((prev) => prev.filter((r) => r.id !== id));
    },
    [store]
  );

  const addPattern = useCallback(
    async (min_count: number, max_count: number) => {
      const pattern = await store.addPattern(min_count, max_count);
      setPatterns((prev) => [...prev, pattern]);
    },
    [store]
  );

  const deletePattern = useCallback(
    async (id: string) => {
      await store.deletePattern(id);
      setPatterns((prev) => prev.filter((p) => p.id !== id));
    },
    [store]
  );

  return {
    rewards,
    patterns,
    loading,
    addReward,
    deleteReward,
    addPattern,
    deletePattern,
  };
}
