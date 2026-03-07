import { db } from "@/lib/firebase/client";
import { DataStore, Progress, Reward, RewardPattern, Task } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Firestore コレクションのパスヘルパー */
const paths = (uid: string) => ({
  tasks: () => collection(db, "users", uid, "tasks"),
  task: (id: string) => doc(db, "users", uid, "tasks", id),
  rewards: () => collection(db, "users", uid, "rewards"),
  reward: (id: string) => doc(db, "users", uid, "rewards", id),
  patterns: () => collection(db, "users", uid, "reward_patterns"),
  pattern: (id: string) => doc(db, "users", uid, "reward_patterns", id),
  progress: () => doc(db, "users", uid, "progress", "current"),
});

/** ログインモード用 DataStore（Firestore ベース） */
export const createFirestoreStore = (uid: string): DataStore => {
  const p = paths(uid);

  return {
    async getTasks(): Promise<Task[]> {
      const q = query(p.tasks(), orderBy("position"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
    },

    async addTask(title: string): Promise<Task> {
      const tasksSnap = await getDocs(p.tasks());
      const position = tasksSnap.size;
      const id = generateId();
      const task: Task = {
        id,
        title,
        is_done: false,
        position,
        created_at: Date.now(),
      };
      await setDoc(p.task(id), task);
      return task;
    },

    async updateTask(
      id: string,
      updates: Partial<Omit<Task, "id" | "created_at">>
    ): Promise<void> {
      await updateDoc(p.task(id), updates);
    },

    async deleteTask(id: string): Promise<void> {
      await deleteDoc(p.task(id));
    },

    async reorderTasks(orderedIds: string[]): Promise<void> {
      const batch = writeBatch(db);
      orderedIds.forEach((id, idx) => {
        batch.update(p.task(id), { position: idx });
      });
      await batch.commit();
    },

    async getRewards(): Promise<Reward[]> {
      const snap = await getDocs(p.rewards());
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Reward));
    },

    async addReward(content: string, weight: number): Promise<Reward> {
      const id = generateId();
      const reward: Reward = { id, content, weight, created_at: Date.now() };
      await setDoc(p.reward(id), reward);
      return reward;
    },

    async deleteReward(id: string): Promise<void> {
      await deleteDoc(p.reward(id));
    },

    async getPatterns(): Promise<RewardPattern[]> {
      const snap = await getDocs(p.patterns());
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RewardPattern));
    },

    async addPattern(min_count: number, max_count: number): Promise<RewardPattern> {
      const id = generateId();
      const pattern: RewardPattern = {
        id,
        min_count,
        max_count,
        created_at: Date.now(),
      };
      await setDoc(p.pattern(id), pattern);
      return pattern;
    },

    async deletePattern(id: string): Promise<void> {
      await deleteDoc(p.pattern(id));
    },

    async getProgress(): Promise<Progress> {
      const snap = await getDoc(p.progress());
      if (!snap.exists()) {
        const defaultProgress: Progress = { done_count: 0, target_count: 0 };
        await setDoc(p.progress(), defaultProgress);
        return defaultProgress;
      }
      return snap.data() as Progress;
    },

    async updateProgress(progress: Progress): Promise<void> {
      await setDoc(p.progress(), progress);
    },
  };
};
