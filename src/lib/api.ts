import { supabase, Post } from './supabase';

// 記事一覧を取得（新しい順）
export async function getPosts(): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return data || [];
}

// 特定の記事を取得
export async function getPostById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }

    return data;
}

// 記事を作成
export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post | null> {
    const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select()
        .single();

    if (error) {
        console.error('Error creating post:', error);
        return null;
    }

    return data;
}

// 記事を更新
export async function updatePost(id: string, post: Partial<Post>): Promise<Post | null> {
    const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating post:', error);
        return null;
    }

    return data;
}

// 記事を削除
export async function deletePost(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        return false;
    }

    return true;
}

// 画像をアップロード
export async function uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    // 公開URLを取得
    const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// タグでフィルタリング
export async function getPostsByTag(tag: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .contains('tags', [tag])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts by tag:', error);
        return [];
    }

    return data || [];
}

// 学習ノート（Markdownファイル）をアップロード
export async function uploadStudyNotes(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from('study-notes')
        .upload(filePath, file, {
            contentType: 'text/markdown',
        });

    if (error) {
        console.error('Error uploading study notes:', error);
        return null;
    }

    // 公開URLを取得
    const { data } = supabase.storage
        .from('study-notes')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
