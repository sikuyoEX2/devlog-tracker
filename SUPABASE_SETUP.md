# Supabaseセットアップガイド

DevLog TrackerのバックエンドとしてSupabaseを設定する手順です。

## 1. Supabaseアカウント作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインイン（または新規登録）

## 2. 新しいプロジェクトを作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Name**: `devlog-tracker`
   - **Database Password**: 強力なパスワードを設定（必ず保存してください）
   - **Region**: `Northeast Asia (Tokyo)` を選択（日本から最も近い）
3. 「Create new project」をクリック
4. プロジェクトの初期化を待つ（1〜2分）

## 3. データベーステーブルの作成

1. 左サイドバーから「SQL Editor」を選択
2. 「New Query」をクリック
3. 以下のSQLをコピー&ペースト：

```sql
-- postsテーブルを作成
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('learning', 'coding', 'debugging', 'done')),
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- created_atでインデックスを作成（タイムライン表示の高速化）
CREATE INDEX posts_created_at_idx ON posts (created_at DESC);

-- Row-Level Security (RLS) ポリシーの設定
-- 個人用の開発ログなので、すべての操作を許可
-- 将来認証を追加する場合は、これらのポリシーを変更してください

-- 誰でもpostsを読み取り可能
CREATE POLICY "Enable read access for all users" ON posts
  FOR SELECT
  USING (true);

-- 誰でもpostsを挿入可能
CREATE POLICY "Enable insert access for all users" ON posts
  FOR INSERT
  WITH CHECK (true);

-- 誰でもpostsを更新可能
CREATE POLICY "Enable update access for all users" ON posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 誰でもpostsを削除可能
CREATE POLICY "Enable delete access for all users" ON posts
  FOR DELETE
  USING (true);
```

4. 「Run」をクリックして実行

> [!IMPORTANT]
> これらのRLSポリシーは、誰でもデータベースに対してすべての操作を実行できるようにします。個人用の開発ログとして使用する場合は問題ありませんが、公開アプリケーションとして展開する場合は、適切な認証とポリシーを実装してください。

## 4. ストレージバケットの作成（画像用）

1. 左サイドバーから「Storage」を選択
2. 「Create a new bucket」をクリック
3. 以下を入力：
   - **Name**: `post-images`
   - **Public bucket**: チェックを入れる（画像を公開するため）
4. 「Create bucket」をクリック

## 5. 環境変数の取得

1. 左サイドバーから「Settings」→「API」を選択
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co` の形式
   - **anon public**: `eyJ...` で始まる長い文字列

## 6. プロジェクトに環境変数を設定

1. `devlog-tracker`フォルダに `.env.local` ファイルを作成
2. 以下の内容を記述（xxxの部分を実際の値に置き換える）：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...あなたのキー...
```

3. ファイルを保存

## 7. 動作確認

セットアップが完了したら、アプリケーションを起動して動作確認します：

```powershell
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスできれば成功です。

## トラブルシューティング

### データベース接続エラー
- `.env.local`のURLとキーが正しいか確認
- Supabaseプロジェクトが正常に起動しているか確認

### 画像アップロードエラー
- ストレージバケット`post-images`が「Public」として作成されているか確認
- バケット名が正しいか確認

## 次のステップ

Supabaseのセットアップが完了したら、DevLog Trackerの開発を続行できます！
