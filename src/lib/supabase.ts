import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type Post = {
  id: string;
  title: string;
  content: string;
  status: 'learning' | 'coding' | 'debugging' | 'done';
  tags: string[];
  image_url: string | null;
  study_notes_url: string | null;
  code_file_url: string | null;
  created_at: string;
  updated_at: string;
};
