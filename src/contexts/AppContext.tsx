"use client";

import { createLocalStore } from "@/lib/localStorage";
import { AppMode, DataStore } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const MODE_KEY = "rewardo_mode";

interface AppContextValue {
  mode: AppMode | null;
  store: DataStore | null;
  uid: string | null;
  setMode: (mode: AppMode, uid?: string) => void;
  clearMode: () => void;
}

const AppContext = createContext<AppContextValue>({
  mode: null,
  store: null,
  uid: null,
  setMode: () => {},
  clearMode: () => {},
});

/** アプリのモードと DataStore を全体に配布するプロバイダー */
export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode | null>(null);
  const [store, setStore] = useState<DataStore | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  // 初期化: localStorage からモードを読み込む
  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY) as AppMode | null;
    if (saved === "guest") {
      setModeState("guest");
      setStore(createLocalStore());
    } else if (saved === "login") {
      // Firebase Auth の状態を監視してログインモードを復元
      initFirebaseLoginMode();
    }
  }, []);

  const initFirebaseLoginMode = async () => {
    const { auth } = await import("@/lib/firebase/client");
    const { onAuthStateChanged } = await import("firebase/auth");
    const { createFirestoreStore } = await import("@/lib/firestore");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setModeState("login");
        setUid(user.uid);
        setStore(createFirestoreStore(user.uid));
        localStorage.setItem(MODE_KEY, "login");
      } else {
        // 未ログイン状態になったらリセット
        setModeState(null);
        setUid(null);
        setStore(null);
        localStorage.removeItem(MODE_KEY);
      }
    });
  };

  const setMode = (newMode: AppMode, newUid?: string) => {
    localStorage.setItem(MODE_KEY, newMode);
    setModeState(newMode);

    if (newMode === "guest") {
      setStore(createLocalStore());
      setUid(null);
    } else if (newMode === "login" && newUid) {
      setUid(newUid);
      import("@/lib/firestore").then(({ createFirestoreStore }) => {
        setStore(createFirestoreStore(newUid));
      });
    }
  };

  const clearMode = async () => {
    localStorage.removeItem(MODE_KEY);
    setModeState(null);
    setStore(null);
    setUid(null);

    // ログインモードの場合は Firebase サインアウトも実行
    if (mode === "login") {
      const { signOutUser } = await import("@/lib/firebase/auth");
      await signOutUser();
    }
  };

  return (
    <AppContext.Provider value={{ mode, store, uid, setMode, clearMode }}>
      {children}
    </AppContext.Provider>
  );
}

/** AppContext を使うカスタムフック */
export function useApp() {
  return useContext(AppContext);
}

/** store を確実に取得するフック（store が null の場合は例外を throw） */
export function useStore(): DataStore {
  const { store } = useApp();
  if (!store) throw new Error("DataStore is not initialized");
  return store;
}
