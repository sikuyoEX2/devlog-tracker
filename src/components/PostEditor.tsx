'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, uploadImage, uploadStudyNotes, uploadCodeFile } from '@/lib/api';
import { Post } from '@/lib/supabase';

// Rust関連の拡張子
const RUST_EXTENSIONS = ['.rs', '.toml', '.lock'];

type PostEditorProps = {
    post?: Post;
    isEdit?: boolean;
};

export default function PostEditor({ post, isEdit = false }: PostEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [status, setStatus] = useState<'learning' | 'coding' | 'debugging' | 'done'>(
        post?.status || 'learning'
    );
    const [tags, setTags] = useState(post?.tags.join(', ') || '');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(post?.image_url || '');
    const [studyNotesFile, setStudyNotesFile] = useState<File | null>(null);
    const [studyNotesFileName, setStudyNotesFileName] = useState<string>(
        post?.study_notes_url ? '既存のファイルあり' : ''
    );
    const [codeFile, setCodeFile] = useState<File | null>(null);
    const [codeFileName, setCodeFileName] = useState<string>(
        post?.code_file_url ? '既存のファイルあり' : ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 学習ノートファイルを選択
    const handleStudyNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.md')) {
            setStudyNotesFile(file);
            setStudyNotesFileName(file.name);
        }
    };

    // コードファイルを選択
    const handleCodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && RUST_EXTENSIONS.some(ext => file.name.endsWith(ext))) {
            setCodeFile(file);
            setCodeFileName(file.name);
        }
    };

    // ドラッグ&ドロップ用ハンドラ
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.name.endsWith('.md')) {
            setStudyNotesFile(file);
            setStudyNotesFileName(file.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = post?.image_url || null;
            let studyNotesUrl = post?.study_notes_url || null;
            let codeFileUrl = post?.code_file_url || null;

            // 画像がアップロードされている場合
            if (image) {
                const uploadedUrl = await uploadImage(image);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            // 学習ノートファイルがアップロードされている場合
            if (studyNotesFile) {
                const uploadedUrl = await uploadStudyNotes(studyNotesFile);
                if (uploadedUrl) {
                    studyNotesUrl = uploadedUrl;
                }
            }

            // コードファイルがアップロードされている場合
            if (codeFile) {
                const uploadedUrl = await uploadCodeFile(codeFile);
                if (uploadedUrl) {
                    codeFileUrl = uploadedUrl;
                }
            }

            const postData = {
                title,
                content,
                status,
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                image_url: imageUrl,
                study_notes_url: studyNotesUrl,
                code_file_url: codeFileUrl,
            };

            if (isEdit && post) {
                await updatePost(post.id, postData);
            } else {
                await createPost(postData);
            }

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('記事の保存に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {isEdit ? '記事を編集' : '新しい記事を投稿'}
            </h1>

            <div className="space-y-6">
                {/* タイトル */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        タイトル
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="例: Rustでブートローダーを実装した"
                    />
                </div>

                {/* ステータス */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        進捗ステータス
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="learning">📚 学習中</option>
                        <option value="coding">💻 実装中</option>
                        <option value="debugging">🐛 デバッグ中</option>
                        <option value="done">✅ 完了</option>
                    </select>
                </div>

                {/* タグ */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        タグ（カンマ区切り）
                    </label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="例: Rust, カーネル実装, メモリ管理"
                    />
                </div>

                {/* 画像アップロード */}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        画像（オプション）
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <img src={imagePreview} alt="Preview" className="max-w-md rounded-lg shadow-md" />
                        </div>
                    )}
                </div>

                {/* 学習ノートファイルアップロード（苦労の跡） */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📝 苦労の跡（学習ノートファイル）
                    </label>
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
                    >
                        <div className="text-center">
                            {studyNotesFileName ? (
                                <div className="text-green-600 dark:text-green-400 mb-2">
                                    ✅ {studyNotesFileName}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    .mdファイルをドラッグ&ドロップ
                                </p>
                            )}
                            <p className="text-gray-500 dark:text-gray-500 text-sm mb-3">または</p>
                            <label htmlFor="studyNotesFile" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                                ファイルを選択
                            </label>
                            <input
                                type="file"
                                id="studyNotesFile"
                                accept=".md"
                                onChange={handleStudyNotesChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        ※ AIとの勉強の記録を別タブで閲覧できるリンクとして保存されます
                    </p>
                </div>

                {/* 今日のコード（Rustファイル） */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🦀 今日のコード（Rustファイル）
                    </label>
                    <div className="w-full p-6 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400 transition-colors bg-orange-50 dark:bg-orange-900/20 cursor-pointer">
                        <div className="text-center">
                            {codeFileName ? (
                                <div className="text-green-600 dark:text-green-400 mb-2">
                                    ✅ {codeFileName}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    .rs / .toml / .lockファイルを選択
                                </p>
                            )}
                            <p className="text-gray-500 dark:text-gray-500 text-sm mb-3">Rust関連ファイル</p>
                            <label htmlFor="codeFile" className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg cursor-pointer transition-colors">
                                ファイルを選択
                            </label>
                            <input
                                type="file"
                                id="codeFile"
                                accept=".rs,.toml,.lock"
                                onChange={handleCodeFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        ※ 今日書いたコードを別タブで閲覧できるリンクとして保存されます
                    </p>
                </div>
                {/* 本文 */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        本文（Markdown形式）
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={20}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        placeholder="Markdownで記事を書きましょう...&#10;&#10;例:&#10;## 今日やったこと&#10;&#10;```rust&#10;fn main() {&#10;    println!(&quot;Hello, OS!&quot;);&#10;}&#10;```"
                    />
                </div>

                {/* ボタン */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        {isSubmitting ? '保存中...' : isEdit ? '更新する' : '投稿する'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </form>
    );
}
