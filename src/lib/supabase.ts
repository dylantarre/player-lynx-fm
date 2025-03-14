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

// Create Supabase client with persistSession: false as per project requirements
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // As per project requirements
  }
});

// Simplified interface for authentication as per project memory
export const lynxSupabase = {
  async signInWithPassword(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { success: !error, user: data.user, error };
    } catch (error) {
      return { success: false, user: null, error };
    }
  },

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { success: !error, user: data.user, error };
    } catch (error) {
      return { success: false, user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { success: !error, user, error };
    } catch (error) {
      return { success: false, user: null, error };
    }
  }
};