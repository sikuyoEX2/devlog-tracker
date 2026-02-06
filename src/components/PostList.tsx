'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/supabase';
import StatusBadge from './StatusBadge';

type PostListProps = {
    posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    まだ記事がありません。最初の開発記録を投稿しましょう！
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h2>
                                <div className="flex items-center gap-3 mb-3">
                                    <StatusBadge status={post.status} />
                                    <time className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(post.created_at).toLocaleDateString('ja-JP', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {post.content.substring(0, 200)}...
                                </p>
                            </div>
                            {post.image_url && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
