import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    ENV: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_API_BASE_URL: string;
    };
  }
}

// Get environment variables with fallbacks
const getEnvVar = (key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY' | 'VITE_API_BASE_URL'): string => {
  const value = window.ENV?.[key] || import.meta.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not defined`);
  }
  return value;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Debug information for environment variables
console.log('Supabase URL defined:', !!supabaseUrl);
console.log('Supabase Anon Key defined:', !!supabaseAnonKey);

// Create Supabase client with Zero Trust compatible configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  }
});

// Simplified interface for authentication as per project memory
export const lynxSupabase = {
  async signInWithPassword(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { success: !error, user: data?.user || null, error };
    } catch (error) {
      console.error('Authentication error:', error);
      return { 
        success: false, 
        user: null, 
        error: new Error('Unable to connect. Please check your network connection and try again.')
      };
    }
  },

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { success: !error, user: data?.user || null, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        user: null, 
        error: new Error('Unable to connect. Please check your network connection and try again.')
      };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { success: !error, error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { 
        success: false, 
        error: new Error('Unable to sign out. Please try again.')
      };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { success: !error, user: user || null, error };
    } catch (error) {
      console.error('Get user error:', error);
      return { 
        success: false, 
        user: null, 
        error: new Error('Unable to get user information. Please try again.')
      };
    }
  }
};