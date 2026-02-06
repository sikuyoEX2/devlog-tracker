import { getPostById } from '@/lib/api';
import PostDetail from '@/components/PostDetail';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PageProps) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* ヘッダー */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2"
                        >
                            <span>←</span>
                            <span>記事一覧に戻る</span>
                        </Link>
                        <Link
                            href={`/edit/${post.id}`}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2"
                        >
                            <span>✏️</span>
                            <span>編集</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <PostDetail post={post} />
            </main>
        </div>
    );
}
