# DevLog Tracker

自作OS開発の進捗を記録・可視化するWebアプリケーションです。

## 特徴

- 📝 **Markdown対応**: コードブロックのシンタックスハイライト付きで技術記事を投稿
- 🏷️ **進捗ステータス**: 学習中・実装中・デバッグ中・完了のステータス管理
- 📅 **タイムライン表示**: 開発の履歴を逆時系列で表示
- 🏷️ **タグ管理**: カテゴリごとに記事を分類
- 🖼️ **画像アップロード**: スクリーンショットを添付可能
- 🌙 **ダークモード**: 自動的にシステム設定に対応

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + Storage)
- **Markdown**: react-markdown + react-syntax-highlighter
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseのセットアップ

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

簡単な手順：
1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQLエディタでテーブルを作成
3. ストレージバケット`post-images`を作成（公開設定）
4. プロジェクトURLとAPIキーを取得

### 3. 環境変数の設定

`.env.local`ファイルを作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

1. **新規投稿**: トップページの「新規投稿」ボタンをクリック
2. **記事作成**: Markdown形式で記事を書き、ステータスとタグを設定
3. **画像追加**: 必要に応じて画像をアップロード
4. **投稿**: 「投稿する」ボタンで公開
5. **編集**: 記事詳細ページから編集可能

## プロジェクト構造

```
devlog-tracker/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # ホーム（記事一覧）
│   │   ├── new/             # 新規投稿ページ
│   │   ├── posts/[id]/      # 記事詳細ページ
│   │   └── edit/[id]/       # 編集ページ
│   ├── components/          # Reactコンポーネント
│   │   ├── PostList.tsx     # 記事一覧
│   │   ├── PostDetail.tsx   # 記事詳細
│   │   ├── PostEditor.tsx   # 投稿・編集フォーム
│   │   └── StatusBadge.tsx  # ステータスバッジ
│   └── lib/                 # ユーティリティ
│       ├── supabase.ts      # Supabaseクライアント
│       └── api.ts           # データベースAPI
├── SUPABASE_SETUP.md        # Supabase設定ガイド
└── README.md
```

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. デプロイを実行

## ライセンス

MIT
