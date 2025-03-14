import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug information for environment variables
console.log('Supabase URL defined:', !!supabaseUrl);
console.log('Supabase Anon Key defined:', !!supabaseAnonKey);

// Fallback to development values if environment variables are not set
// IMPORTANT: This is only for development, should be removed in production
const fallbackUrl = 'https://your-fallback-supabase-url.supabase.co';
const fallbackKey = 'your-fallback-anon-key';

// Use environment variables if available, otherwise use fallbacks
const url = supabaseUrl || fallbackUrl;
const key = supabaseAnonKey || fallbackKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using fallback Supabase credentials. This should only happen in development.');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: false // As per project requirements
  }
});