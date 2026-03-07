/** タスクのデータ型 */
export interface Task {
  id: string;
  title: string;
  is_done: boolean;
  position: number;
  created_at: number;
}

/** ご褒美のデータ型 */
export interface Reward {
  id: string;
  content: string;
  weight: number;
  created_at: number;
}

/** ご褒美パターン（何タスク完了でご褒美を出すかの幅）のデータ型 */
export interface RewardPattern {
  id: string;
  min_count: number;
  max_count: number;
  created_at: number;
}

/** 進捗データ型 */
export interface Progress {
  done_count: number;
  target_count: number;
}

/**
 * データアクセス層の共通インターフェース。
 * ゲストモード（localStorage）とログインモード（Firestore）の両方がこれを実装する。
 */
export interface DataStore {
  // Tasks
  getTasks(): Promise<Task[]>;
  addTask(title: string): Promise<Task>;
  addTasks(titles: string[]): Promise<Task[]>;
  updateTask(id: string, updates: Partial<Omit<Task, "id" | "created_at">>): Promise<void>;
  deleteTask(id: string): Promise<void>;
  reorderTasks(orderedIds: string[]): Promise<void>;

  // Rewards
  getRewards(): Promise<Reward[]>;
  addReward(content: string, weight: number): Promise<Reward>;
  deleteReward(id: string): Promise<void>;

  // Patterns
  getPatterns(): Promise<RewardPattern[]>;
  addPattern(min_count: number, max_count: number): Promise<RewardPattern>;
  deletePattern(id: string): Promise<void>;

  // Progress
  getProgress(): Promise<Progress>;
  updateProgress(progress: Progress): Promise<void>;
}

/** アプリのモード */
export type AppMode = "guest" | "login";
