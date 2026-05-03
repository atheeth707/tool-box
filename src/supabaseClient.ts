import { createClient } from '@supabase/supabase-js';

// These come from your Vercel Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom Type for our Profile
export interface Profile {
  id: string;
  email: string;
  avatar_url: string;
  credits: number;
}