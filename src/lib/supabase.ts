import { createClient } from '@supabase/supabase-js';

// Define types for our global environment variables
declare global {
  interface Window {
    ENV: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_API_BASE_URL: string;
    };
  }
}

// Access environment variables from global ENV object or fall back to Vite env
const getEnvVariables = () => {
  // Check if window and ENV are defined (for SSR compatibility)
  if (typeof window !== 'undefined' && window.ENV) {
    return {
      supabaseUrl: window.ENV.VITE_SUPABASE_URL || '',
      supabaseAnonKey: window.ENV.VITE_SUPABASE_ANON_KEY || '',
      apiBaseUrl: window.ENV.VITE_API_BASE_URL || '/api'
    };
  }
  
  // Fallback to Vite environment variables (for development)
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api'
  };
};

const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = getEnvVariables();

// Log environment variables for debugging
console.log('Environment Variables Check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl || 'Undefined');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[HIDDEN]' : 'Undefined');
console.log('VITE_API_BASE_URL:', apiBaseUrl || 'Undefined');

// Show warning in development if using fallbacks
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using fallback Supabase credentials. This should only happen in development.');
}

// Create and export the Supabase client with simplified configuration
export const supabase = createClient(
  // Provide fallbacks for development - these should be replaced in production
  supabaseUrl || 'https://xyzcompany.supabase.co',
  supabaseAnonKey || 'public-anon-key',
  {
    auth: {
      persistSession: false, // As per project requirements
      autoRefreshToken: true,
      detectSessionInUrl: false // Disable automatic URL detection which can cause issues with proxies
    },
    global: {
      fetch: (...args) => {
        // Custom fetch handler with improved error handling for network issues
        return fetch(...args).catch(error => {
          console.error('Supabase fetch error:', error);
          throw new Error('Network error when connecting to Supabase. Please check your connection and try again.');
        });
      }
    }
  }
);