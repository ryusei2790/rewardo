"use client";

import { Header } from "@/components/layout/Header";
import { RewardModal } from "@/components/reward/RewardModal";
import { AddTaskForm } from "@/components/task/AddTaskForm";
import { TaskList } from "@/components/task/TaskList";
import { useApp } from "@/contexts/AppContext";
import { useProgress } from "@/hooks/useProgress";
import { useRewards } from "@/hooks/useRewards";
import { useTasks } from "@/hooks/useTasks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** タスク管理ページ（/home） */
export default function HomPage() {
  const { mode } = useApp();
  const router = useRouter();

  // モードが未設定ならトップへリダイレクト
  useEffect(() => {
    if (mode === null) {
      router.replace("/");
    }
  }, [mode, router]);

  if (mode === null) return null;

  return <HomeContent />;
}

function HomeContent() {
  const { tasks, loading, addTask, addTasks, toggleTask, deleteTask, reorderTasks } =
    useTasks();
  const { rewards, patterns } = useRewards();
  const { pendingReward, increment, clearPendingReward } =
    useProgress();

  const handleToggle = (id: string) => {
    toggleTask(id, () => increment(rewards, patterns));
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* タスク追加フォーム */}
        <div className="mb-4">
          <AddTaskForm onAdd={addTask} onAddBulk={addTasks} />
        </div>

        {/* タスク一覧 */}
        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-600">読み込み中...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={deleteTask}
            onReorder={reorderTasks}
          />
        )}
      </main>

      {/* ご褒美モーダル */}
      {pendingReward && (
        <RewardModal reward={pendingReward} onClose={clearPendingReward} />
      )}
    </>
  );
}
