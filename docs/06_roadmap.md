# 実装ロードマップ

## 開発フェーズ

### Phase 1：プロジェクト初期化

- [ ] `create-next-app` でプロジェクト作成（TypeScript・Tailwind・App Router）
- [ ] Firebase CLI セットアップ
- [ ] 必要パッケージのインストール（dnd-kit / canvas-confetti / firebase）
- [ ] `.env.local` の設定
- [ ] Vercel プロジェクト作成・GitHub連携

### Phase 2：ゲストモード実装（ローカルストレージ）

- [ ] `lib/storage.ts` 実装：タスク・ご褒美・パターン・進捗のCRUD
- [ ] トップページ `/`：ゲスト / ログイン のモード選択UI
- [ ] ゲストモードでホーム画面が動作することを確認
- [ ] ゲストモードでご褒美設定ページが動作することを確認

### Phase 3：タスク管理（ホーム画面）

- [ ] タスク追加フォーム（`AddTaskForm.tsx`）
- [ ] タスクアイテム表示（`TaskItem.tsx`）
- [ ] チェックで完了（is_done 更新）
- [ ] タスク削除
- [ ] 完了済みタスクを下部に薄表示

### Phase 4：ドラッグ並び替え

- [ ] `@dnd-kit/core` + `@dnd-kit/sortable` 導入
- [ ] `TaskList.tsx` にSortableContext実装
- [ ] ドラッグ完了時に position を更新

### Phase 5：ご褒美設定ページ

- [ ] `/reward-settings` ページ作成
- [ ] `RewardList.tsx`：ご褒美の登録（内容 + 重み）・一覧・削除
- [ ] `RewardPatternList.tsx`：パターンの登録（min / max）・一覧・削除

### Phase 6：ご褒美発動ロジック

- [ ] `lib/reward.ts` の実装
  - `pickTargetCount(patterns)` - パターンからターゲット数を抽選
  - `pickReward(rewards)` - 重み付き抽選でご褒美を1つ選ぶ
- [ ] タスク完了時に進捗カウントを更新
- [ ] `done_count === target_count` でご褒美発動
- [ ] 発動後にカウントリセット・次の `target_count` を再抽選
- [ ] `RewardModal.tsx`：canvas-confetti + ご褒美内容表示

### Phase 7：ログインモード実装（Firebase）

- [ ] Firebase でプロジェクト作成・Firestore / Authentication 有効化
- [ ] Google認証プロバイダ有効化
- [ ] Firestoreセキュリティルール（`firestore.rules`）設定
- [ ] `lib/firebase/client.ts` 実装（アプリ初期化・auth・db エクスポート）
- [ ] `/login` ページ作成（Googleログインボタン）
- [ ] ログアウト機能
- [ ] ホーム・ご褒美設定ページをFirestoreモードに対応（モード分岐）

### Phase 8：デプロイ

- [ ] Vercel に環境変数設定（NEXT_PUBLIC_FIREBASE_API_KEY など6変数）
- [ ] 本番デプロイ・動作確認
- [ ] Firebase ConsoleのAuthorizedドメインにVercelドメインを追加

---

## 将来の拡張候補

| 機能 | 優先度 | 説明 |
|------|--------|------|
| 日付リセット | 中 | 翌日になったら完了タスクを自動クリア |
| ご褒美履歴 | 低 | 過去に当たったご褒美の履歴表示 |
| 統計・グラフ | 低 | 完了数の推移グラフ |
| PWA対応 | 低 | スマホのホーム画面に追加できるようにする |
| テーマ切替 | 低 | ライト/ダークモード切替 |
