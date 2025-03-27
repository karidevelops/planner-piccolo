
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values (for development only)
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
