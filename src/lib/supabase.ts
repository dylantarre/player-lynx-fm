import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    __env: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_API_BASE_URL: string;
    };
  }
}

// Try to get environment variables from runtime config first, then fall back to Vite env
const getRuntimeConfig = () => {
  if (typeof window !== 'undefined' && window.__env) {
    return {
      supabaseUrl: window.__env.VITE_SUPABASE_URL,
      supabaseAnonKey: window.__env.VITE_SUPABASE_ANON_KEY,
      apiBaseUrl: window.__env.VITE_API_BASE_URL
    };
  }
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL
  };
};

const { supabaseUrl, supabaseAnonKey } = getRuntimeConfig();

// Debug information for environment variables
console.log('Environment Variables Check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl || 'Undefined');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[HIDDEN]' : 'Undefined');
console.log('VITE_API_BASE_URL:', getRuntimeConfig().apiBaseUrl || 'Undefined');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using fallback Supabase credentials. This should only happen in development.');
}

export const supabase = createClient(
  supabaseUrl || 'https://your-fallback-supabase-url.supabase.co',
  supabaseAnonKey || 'your-fallback-anon-key',
  {
    auth: {
      persistSession: false, // As per project requirements
      autoRefreshToken: true,
      detectSessionInUrl: false // Disable automatic URL detection which can cause issues with proxies
    },
    global: {
      fetch: (...args) => {
        // Custom fetch handler with improved error handling for Zero Trust environments
        return fetch(...args).catch(error => {
          console.error('Supabase fetch error:', error);
          throw new Error('Network error when connecting to Supabase. Please check your connection and try again.');
        });
      }
    }
  }
);