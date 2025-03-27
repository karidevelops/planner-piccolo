
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
// Find these in your Supabase project settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized with URL:', supabaseUrl);
// Useful warning if using placeholder URLs
if (supabaseUrl.includes('your-supabase-url')) {
  console.warn('⚠️ Using placeholder Supabase URL. Please set your actual Supabase URL in environment variables or replace directly in src/lib/supabase.ts');
}
