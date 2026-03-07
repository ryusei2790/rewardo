"use client";

import { useApp } from "@/contexts/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

/** アプリ上部のナビゲーションヘッダー */
export function Header() {
  const { mode, clearMode } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    clearMode();
    router.push("/");
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link
          href="/home"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Rewardo
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/reward-settings"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ご褒美設定
          </Link>
          {mode === "login" && (
            <button
              onClick={handleLogout}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ログアウト
            </button>
          )}
          {mode === "guest" && (
            <button
              onClick={handleLogout}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              終了
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
