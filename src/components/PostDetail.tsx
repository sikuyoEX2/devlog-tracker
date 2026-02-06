'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Post } from '@/lib/supabase';
import StatusBadge from './StatusBadge';

type PostDetailProps = {
    post: Post;
};

export default function PostDetail({ post }: PostDetailProps) {
    return (
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                    <StatusBadge status={post.status} />
                    <time className="text-gray-500 dark:text-gray-400">
                        投稿日: {new Date(post.created_at).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                    {post.updated_at !== post.created_at && (
                        <time className="text-gray-500 dark:text-gray-400 text-sm">
                            更新日: {new Date(post.updated_at).toLocaleDateString('ja-JP')}
                        </time>
                    )}
                </div>
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {post.image_url && (
                <div className="mb-8">
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full rounded-lg shadow-md"
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;

                            return isInline ? (
                                <code {...props}>
                                    {children}
                                </code>
                            ) : (
                                <SyntaxHighlighter
                                    style={vscDarkPlus as any}
                                    language={match[1]}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        },
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
