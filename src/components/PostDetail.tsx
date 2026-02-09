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

            {/* 苦労の跡リンク */}
            {post.study_notes_urls && post.study_notes_urls.length > 0 && (
                <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📝</span>
                        <span className="font-medium text-purple-700 dark:text-purple-300">苦労の跡（学習ノート）- {post.study_notes_urls.length}件</span>
                    </div>
                    <div className="space-y-2">
                        {post.study_notes_urls.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors text-sm"
                            >
                                <span>📄 ノート {index + 1}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* 今日のコードリンク */}
            {post.code_file_urls && post.code_file_urls.length > 0 && (
                <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🦀</span>
                        <span className="font-medium text-orange-700 dark:text-orange-300">今日のコード（Rustファイル）- {post.code_file_urls.length}件</span>
                    </div>
                    <div className="space-y-2">
                        {post.code_file_urls.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors text-sm"
                            >
                                <span>📄 コード {index + 1}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
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
