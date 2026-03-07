"use client";

import { useStore } from "@/contexts/AppContext";
import { Task } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string, onComplete?: () => void) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (orderedIds: string[]) => Promise<void>;
}

/** タスクの CRUD と並び替えを管理するカスタムフック */
export function useTasks(): UseTasksReturn {
  const store = useStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    store
      .getTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [store]);

  const addTask = useCallback(
    async (title: string) => {
      const task = await store.addTask(title);
      setTasks((prev) => [...prev, task]);
    },
    [store]
  );

  const toggleTask = useCallback(
    async (id: string, onComplete?: () => void) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const newDone = !task.is_done;
      await store.updateTask(id, { is_done: newDone });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_done: newDone } : t))
      );

      if (newDone && onComplete) {
        onComplete();
      }
    },
    [store, tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await store.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [store]
  );

  const reorderTasks = useCallback(
    async (orderedIds: string[]) => {
      await store.reorderTasks(orderedIds);
      setTasks((prev) => {
        const map = new Map(prev.map((t) => [t.id, t]));
        return orderedIds
          .map((id, idx) => {
            const t = map.get(id);
            return t ? { ...t, position: idx } : null;
          })
          .filter(Boolean) as Task[];
      });
    },
    [store]
  );

  return { tasks, loading, addTask, toggleTask, deleteTask, reorderTasks };
}
