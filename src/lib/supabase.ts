import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-url.supabase.co';
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
