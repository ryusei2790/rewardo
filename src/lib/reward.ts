import { Reward, RewardPattern } from "@/types";

/**
 * パターン一覧からランダムに1つ選び、min〜maxの整数をtarget_countとして返す。
 * パターンが空の場合はデフォルト値（5）を返す。
 */
export function pickTargetCount(patterns: RewardPattern[]): number {
  if (patterns.length === 0) return 5;

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const { min_count, max_count } = pattern;

  if (min_count >= max_count) return min_count;
  return Math.floor(Math.random() * (max_count - min_count + 1)) + min_count;
}

/**
 * 重み付き加重抽選でRewardを1つ選ぶ。
 * 累積重み法を使用し、weightが大きいほど当選確率が高い。
 * ご褒美が空の場合は null を返す。
 */
export function pickReward(rewards: Reward[]): Reward | null {
  if (rewards.length === 0) return null;

  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  const rand = Math.random() * totalWeight;

  let cumulative = 0;
  for (const reward of rewards) {
    cumulative += reward.weight;
    if (rand < cumulative) return reward;
  }

  return rewards[rewards.length - 1];
}
