"use client";

import { Header } from "@/components/layout/Header";
import { PatternForm } from "@/components/reward/PatternForm";
import { PatternList } from "@/components/reward/PatternList";
import { RewardForm } from "@/components/reward/RewardForm";
import { RewardList } from "@/components/reward/RewardList";
import { useApp } from "@/contexts/AppContext";
import { useRewards } from "@/hooks/useRewards";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** ご褒美設定ページ（/reward-settings） */
export default function RewardSettingsPage() {
  const { mode } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (mode === null) {
      router.replace("/");
    }
  }, [mode, router]);

  if (mode === null) return null;

  return <RewardSettingsContent />;
}

function RewardSettingsContent() {
  const {
    rewards,
    patterns,
    loading,
    addReward,
    deleteReward,
    addPattern,
    deletePattern,
  } = useRewards();

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-6">
          <p className="py-8 text-center text-sm text-zinc-600">読み込み中...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* ご褒美セクション */}
          <section>
            <h2 className="mb-4 text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              ご褒美
            </h2>
            <div className="mb-4">
              <RewardForm onAdd={addReward} />
            </div>
            <RewardList rewards={rewards} onDelete={deleteReward} />
          </section>

          {/* パターンセクション */}
          <section>
            <h2 className="mb-4 text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              出現パターン
            </h2>
            <p className="mb-3 text-xs text-zinc-500">
              何タスク完了でご褒美を出すかの幅を設定します。
              複数登録するとランダムに選ばれます。
            </p>
            <div className="mb-4">
              <PatternForm onAdd={addPattern} />
            </div>
            <PatternList patterns={patterns} onDelete={deletePattern} />
          </section>
        </div>
      </main>
    </>
  );
}
