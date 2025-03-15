// This file is used to export environment variables for use in the application
// It will be imported by files that need access to environment variables

// Default values that will be replaced at build time or runtime
export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://go.lynx.fm:3500';
