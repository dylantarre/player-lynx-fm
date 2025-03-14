import { createClient } from '@supabase/supabase-js';
import { getEnvVar } from './env';

// Get Supabase credentials
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Create Supabase client with minimal configuration for Zero Trust
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    autoRefreshToken: false,
    storage: undefined
  }
});

// Simplified interface for authentication as per project requirements
export const lynxSupabase = {
  async signInWithPassword(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: undefined // Disable captcha for Zero Trust
        }
      });
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken: undefined // Disable captcha for Zero Trust
        }
      });
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