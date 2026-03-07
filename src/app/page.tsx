"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** モード選択トップページ（/） */
export default function HomePage() {
  const { mode, setMode } = useApp();
  const router = useRouter();

  // すでにモードが設定済みなら /home へリダイレクト
  useEffect(() => {
    if (mode) {
      router.replace("/home");
    }
  }, [mode, router]);

  const handleGuest = () => {
    setMode("guest");
    router.push("/home");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
          Rewardo
        </h1>
        <p className="mb-10 text-sm text-zinc-400">
          タスクをこなして、ご褒美をゲットしよう
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGuest}
            className="w-full rounded-md bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            ゲストとして始める
          </button>
          <button
            onClick={handleLogin}
            className="w-full rounded-md border border-zinc-700 px-4 py-3 text-sm font-medium text-white hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
          >
            Google でログイン
          </button>
        </div>

        <p className="mt-6 text-xs text-zinc-600">
          ゲストモードのデータはこのデバイスにのみ保存されます
        </p>
      </div>
    </main>
  );
}
