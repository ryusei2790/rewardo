import { DataStore, Progress, Reward, RewardPattern, Task } from "@/types";

const KEYS = {
  tasks: "rewardo_tasks",
  rewards: "rewardo_rewards",
  patterns: "rewardo_patterns",
  progress: "rewardo_progress",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** ゲストモード用 DataStore（localStorage ベース） */
export const createLocalStore = (): DataStore => ({
  async getTasks(): Promise<Task[]> {
    const tasks = readJSON<Task[]>(KEYS.tasks, []);
    return [...tasks].sort((a, b) => a.position - b.position);
  },

  async addTask(title: string): Promise<Task> {
    const tasks = readJSON<Task[]>(KEYS.tasks, []);
    const task: Task = {
      id: generateId(),
      title,
      is_done: false,
      position: tasks.length,
      created_at: Date.now(),
    };
    writeJSON(KEYS.tasks, [...tasks, task]);
    return task;
  },

  async addTasks(titles: string[]): Promise<Task[]> {
    const tasks = readJSON<Task[]>(KEYS.tasks, []);
    const basePosition = tasks.length;
    const now = Date.now();
    const newTasks: Task[] = titles
      .map((t) => t.trim())
      .filter(Boolean)
      .map((title, i) => ({
        id: generateId(),
        title,
        is_done: false,
        position: basePosition + i,
        created_at: now + i,
      }));
    writeJSON(KEYS.tasks, [...tasks, ...newTasks]);
    return newTasks;
  },

  async updateTask(
    id: string,
    updates: Partial<Omit<Task, "id" | "created_at">>
  ): Promise<void> {
    const tasks = readJSON<Task[]>(KEYS.tasks, []);
    writeJSON(
      KEYS.tasks,
      tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = readJSON<Task[]>(KEYS.tasks, []);
    writeJSON(
      KEYS.tasks,
      tasks.filter((t) => t.id !== id)
    );
  },

  async reorderTasks(orderedIds: string[]): Promise<void> {
    const tasks = readJSON<Task[]>(KEYS.tasks, []);
    const updated = tasks.map((t) => {
      const idx = orderedIds.indexOf(t.id);
      return idx !== -1 ? { ...t, position: idx } : t;
    });
    writeJSON(KEYS.tasks, updated);
  },

  async getRewards(): Promise<Reward[]> {
    return readJSON<Reward[]>(KEYS.rewards, []);
  },

  async addReward(content: string, weight: number): Promise<Reward> {
    const rewards = readJSON<Reward[]>(KEYS.rewards, []);
    const reward: Reward = {
      id: generateId(),
      content,
      weight,
      created_at: Date.now(),
    };
    writeJSON(KEYS.rewards, [...rewards, reward]);
    return reward;
  },

  async deleteReward(id: string): Promise<void> {
    const rewards = readJSON<Reward[]>(KEYS.rewards, []);
    writeJSON(
      KEYS.rewards,
      rewards.filter((r) => r.id !== id)
    );
  },

  async getPatterns(): Promise<RewardPattern[]> {
    return readJSON<RewardPattern[]>(KEYS.patterns, []);
  },

  async addPattern(
    min_count: number,
    max_count: number
  ): Promise<RewardPattern> {
    const patterns = readJSON<RewardPattern[]>(KEYS.patterns, []);
    const pattern: RewardPattern = {
      id: generateId(),
      min_count,
      max_count,
      created_at: Date.now(),
    };
    writeJSON(KEYS.patterns, [...patterns, pattern]);
    return pattern;
  },

  async deletePattern(id: string): Promise<void> {
    const patterns = readJSON<RewardPattern[]>(KEYS.patterns, []);
    writeJSON(
      KEYS.patterns,
      patterns.filter((p) => p.id !== id)
    );
  },

  async getProgress(): Promise<Progress> {
    return readJSON<Progress>(KEYS.progress, {
      done_count: 0,
      target_count: 0, // 0 = 未初期化（useProgress で patterns から決める）
    });
  },

  async updateProgress(progress: Progress): Promise<void> {
    writeJSON(KEYS.progress, progress);
  },
});
