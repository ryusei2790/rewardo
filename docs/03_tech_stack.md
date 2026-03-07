# 技術スタック

## 選定方針

- モダンなReactエコシステムで実装経験を積む
- BaaS（Firebase）を活用してバックエンド実装コストを削減
- 型安全なTypeScriptで保守性を確保
- ゲストモードはローカルストレージで完結し、Firebase不要で動作させる

---

## スタック一覧

### フロントエンド

| 技術 | バージョン | 選定理由 |
|------|-----------|----------|
| Next.js | 14（App Router） | SSR・ルーティング・最適化が標準装備。App Routerで最新のReact Server Componentsを活用 |
| React | 18 | Next.jsに内包 |
| TypeScript | 5.x | 型安全性・補完による開発効率向上 |
| Tailwind CSS | 3.x | ユーティリティファーストで素早くUIを構築 |

### バックエンド / BaaS

| 技術 | 選定理由 |
|------|----------|
| Firebase Authentication | Googleログインをすぐに実装可能。uidをそのままFirestoreのパスキーとして利用できる |
| Firestore | サブコレクション構造でユーザーごとのデータ分離が容易。Security Rulesでアクセス制御 |

### ライブラリ

| ライブラリ | 用途 | 選定理由 |
|-----------|------|----------|
| @dnd-kit/core | ドラッグ&ドロップ | アクセシビリティ対応・Reactフレンドリーな設計 |
| @dnd-kit/sortable | リスト並び替え | dnd-kitのソータブル拡張 |
| canvas-confetti | ご褒美アニメーション | 軽量で導入が容易。ブラウザネイティブなアニメーション |
| localStorage API | ゲストモードのデータ永続化 | ブラウザ標準API。ライブラリ不要 |

### インフラ / デプロイ

| 技術 | 用途 |
|------|------|
| Vercel | Next.jsの最適なホスティング先。GitHubと連携した自動デプロイ |
| Firebase | DB・認証のホスティング |

---

## アーキテクチャ概要

```
Browser
  │
  ├─── ゲストモード
  │       └── localStorage（タスク・ご褒美・パターン・進捗）
  │
  └─── ログインモード
          ▼
      Next.js (Vercel)
        ├── App Router
        ├── Server Components（データフェッチ）
        ├── Client Components（インタラクション・dnd-kit）
        └── Firebase SDK（クライアントサイド）
                │
                ▼
             Firebase
               ├── Authentication（Google）
               └── Firestore（Security Rules有効）
```

---

## ディレクトリ構成

```
rewardo/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # 認証ガード
│   │   ├── page.tsx                # ホーム
│   │   └── reward-settings/page.tsx
│   └── layout.tsx
├── components/
│   ├── TaskList.tsx                # dnd-kit sortable list
│   ├── TaskItem.tsx
│   ├── AddTaskForm.tsx
│   ├── RewardModal.tsx             # confetti モーダル
│   ├── RewardList.tsx
│   └── RewardPatternList.tsx
├── lib/
│   ├── firebase/
│   │   └── client.ts               # Firebaseアプリ初期化・クライアント
│   ├── storage.ts                  # ゲストモード用localStorageアクセサ
│   └── reward.ts                   # 抽選ロジック（純粋関数・モード共通）
├── docs/                           # ドキュメント
└── firestore.rules                 # Firestoreセキュリティルール
```

---

## 環境変数

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
