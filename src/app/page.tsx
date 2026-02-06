import Link from 'next/link';
import { getPosts } from '@/lib/api';
import PostList from '@/components/PostList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                DevLog Tracker
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                自作OS開発の進捗記録
              </p>
            </div>
            <Link
              href="/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>✏️</span>
              <span>新規投稿</span>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PostList posts={posts} />
      </main>

      {/* フッター */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            自作OS開発の記録 © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
