import { createClient } from '@supabase/supabase-js';

// Define a type for the global window with ENV property
interface WindowWithEnv extends Window {
  ENV?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
    VITE_API_BASE_URL?: string;
  };
  LYNX_CONFIG?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
    VITE_API_BASE_URL?: string;
  };
}

// Default values for Supabase - only used if environment variables are not available
const DEFAULT_SUPABASE_URL = 'https://fpuueievvvxbgbqtkjyd.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdXVlaWV2dnZ4YmdicXRranlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNTc3MTAsImV4cCI6MjAyNjczMzcxMH0.Nh83ebqzv3RZkOvKlw-UJEYrOYBXcQcmZ9xT9tJgBYY';

// Try to get environment variables from various sources
const supabaseUrl = 
  ((window as WindowWithEnv).LYNX_CONFIG?.VITE_SUPABASE_URL) || 
  ((window as WindowWithEnv).ENV?.VITE_SUPABASE_URL) || 
  import.meta.env.VITE_SUPABASE_URL || 
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  ((window as WindowWithEnv).LYNX_CONFIG?.VITE_SUPABASE_ANON_KEY) || 
  ((window as WindowWithEnv).ENV?.VITE_SUPABASE_ANON_KEY) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  DEFAULT_SUPABASE_ANON_KEY;

// Log configuration status
console.log('=================================================');
console.log('📱 Supabase Configuration Status:');
console.log('=================================================');
console.log('Supabase URL:', supabaseUrl ? `✅ Set (${supabaseUrl})` : '❌ Not Set');
console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Set (Key hidden for security)' : '❌ Not Set');
console.log('=================================================');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { 
    supabaseUrl: supabaseUrl ? 'defined' : 'undefined', 
    supabaseAnonKey: supabaseAnonKey ? 'defined' : 'undefined' 
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);