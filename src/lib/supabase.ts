import { createClient } from '@supabase/supabase-js';

// Define types for our global configuration
declare global {
  interface Window {
    LYNX_CONFIG: {
      supabaseUrl: string;
      supabaseAnonKey: string;
      apiBaseUrl: string;
    };
  }
}

// Get configuration from global LYNX_CONFIG object or fallback to environment variables
const getConfig = () => {
  console.log('🔍 LynxFM: Checking for configuration sources...');
  
  // Check if window and LYNX_CONFIG are defined (for SSR compatibility)
  if (typeof window !== 'undefined' && window.LYNX_CONFIG) {
    console.log('✅ LynxFM: Found LYNX_CONFIG in window object');
    return {
      supabaseUrl: window.LYNX_CONFIG.supabaseUrl,
      supabaseAnonKey: window.LYNX_CONFIG.supabaseAnonKey,
      apiBaseUrl: window.LYNX_CONFIG.apiBaseUrl
    };
  }
  
  // Fallback to Vite environment variables (for development)
  console.log('⚠️ LynxFM: LYNX_CONFIG not found, trying Vite environment variables');
  const config = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api'
  };
  
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    console.error('❌ LynxFM: Critical configuration missing! Authentication will fail.');
  }
  
  return config;
};

const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = getConfig();

// Log configuration for debugging
console.log('=================================================');
console.log('📱 LynxFM Configuration Status:');
console.log('=================================================');
console.log(`Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`Supabase Anon Key: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
console.log(`API Base URL: ${apiBaseUrl ? '✅ Set' : '❌ Missing'} (${apiBaseUrl || 'undefined'})`);
console.log('=================================================');

// Create and export the Supabase client with simplified configuration
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: localStorage
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

// Simplified Lynx-specific Supabase interface
export const lynxSupabase = {
  // Sign in with email and password
  signInWithPassword: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('LynxFM Auth Error:', error.message);
        return { success: false, user: null, error: error.message };
      }
      
      console.log('LynxFM Auth: User signed in successfully');
      return { success: true, user: data.user, error: null };
    } catch (error) {
      console.error('LynxFM Auth Exception:', error);
      return { 
        success: false, 
        user: null, 
        error: error instanceof Error ? error.message : 'Unknown authentication error' 
      };
    }
  },
  
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error('LynxFM Auth Error:', error.message);
        return { success: false, user: null, error: error.message };
      }
      
      console.log('LynxFM Auth: User signed up successfully');
      return { success: true, user: data.user, error: null };
    } catch (error) {
      console.error('LynxFM Auth Exception:', error);
      return { 
        success: false, 
        user: null, 
        error: error instanceof Error ? error.message : 'Unknown authentication error' 
      };
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('LynxFM Auth Error:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('LynxFM Auth: User signed out successfully');
      return { success: true, error: null };
    } catch (error) {
      console.error('LynxFM Auth Exception:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error during sign out' 
      };
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('LynxFM Auth Error:', error.message);
        return { success: false, user: null, error: error.message };
      }
      
      return { success: true, user: data.user, error: null };
    } catch (error) {
      console.error('LynxFM Auth Exception:', error);
      return { 
        success: false, 
        user: null, 
        error: error instanceof Error ? error.message : 'Unknown error getting current user' 
      };
    }
  }
};