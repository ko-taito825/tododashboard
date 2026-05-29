# TodoDashboard
<img width="3420" height="2074" alt="image" src="https://github.com/user-attachments/assets/b6b14923-57bb-4e59-a21d-2a9194436ceb" />



> **UIデザインはFigmaで事前に自身で作成し、そのデザインをもとにAIコーディング（Claude Code）で実装しました。**

## 使用したプロンプト

Claude Codeに以下のプロンプトを渡して実装しました。

```
以下の仕様でtododashboardウェブアプリを実装してください。

## 技術スタック
- フロントエンド: Next.js (App Router)
- バックエンド: Rails (APIモード)
- 環境構築は完了済み

## 機能要件

### ダッシュボード画面
1. Morning Routine - デフォルトでTo-Do3つ表示、チェックで完了
2. Night Routine - デフォルトでTo-Do3つ表示、チェックで完了
3. Today's Habit - 習慣の記録、デフォルトでAdd Task1つ表示
4. Today's Tasks - その日のTodo管理、デフォルトでAdd Task1つ表示
5. Memo - フリーテキストメモ
6. Weather Info - 外部API（OpenWeatherMap）で現在地の天気・気温表示
7. Weekly Task - 週間タスク管理
8. 現在時刻 - リアルタイム表示（右上の大きい数字）
9. タイマー - 30min/1hourのカウントダウンタイマー、FOCUS TIMERボタン
10. Progress - 一週間のタスク完了率をグラフで可視化（完了タスク＋完了習慣／合計）
11. Monthly Agenda - 月間カレンダー、日付クリックで予定追加

## UIデザイン
- 背景: ダークテーマ (#0C0C0C)
- アクセントカラー: 紫 (#7B2FBE)
- Figmaで作成済みのデザイン画像を忠実に再現すること
- レスポンシブ対応は不要

## その他
- APIエンドポイントはRESTful設計
- データはRailsのDBで永続化
- GitHub連携済みのため、機能単位でコミットし、最後にPRを作成して
```

またCLAUDE.mdには以下のルールを定義しています。

```
# TodoDashboard

## 技術スタック
- Next.js v15 (App Router)
- TypeScript (strict モード、any 使用禁止)
- TailwindCSS
- Rails 8 (APIモード、port 3001)
- PostgreSQL (ActiveRecord)
- recharts (Progressグラフ)

## コーディングルール
- すべてのUIコンポーネントは "use client"
- GETはuseFetchベースのカスタムhookで実装
- POST/PUT/DELETEはfrontend/lib/api.ts経由
- 状態管理はuseState / useEffect。Provider / useContextは禁止
- CSSはTailwindCSS（トークン記法を使うこと、任意値[]記法は禁止）
- TypeScriptのany使用禁止
```

---

## 使用技術

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 15 (App Router) / TypeScript / TailwindCSS |
| バックエンド | Ruby on Rails 8 (APIモード) |
| データベース | PostgreSQL |
| グラフ | recharts |
| 天気API | OpenWeatherMap API |
| インフラ | (デプロイ予定) |

---

## 機能一覧

- **Morning / Night Routine** — 朝・夜のルーティン管理。デフォルト3項目、チェックで完了記録
- **Today's Habit** — 日次習慣トラッキング
- **Today's Tasks** — その日のTodo管理
- **Memo** — 自動保存のフリーテキストメモ
- **Weather Info** — 現在地の天気・気温をリアルタイム表示
- **Current Time** — リアルタイム時刻表示
- **Focus Timer** — 25min / 30min / 1hourのカウントダウンタイマー
- **Weekly Task** — 週間タスク管理（7列グリッド）
- **Progress** — 一週間のタスク・習慣完了率を棒グラフで可視化
- **Monthly Agenda** — 月間カレンダー、日付クリックで予定追加
