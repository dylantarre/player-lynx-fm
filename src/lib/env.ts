// Define the environment variable interface
interface LynxEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_API_BASE_URL: string;
}

// Default development values
const defaultEnv: LynxEnv = {
  VITE_SUPABASE_URL: 'https://fpuueievvvxbgbqtkjyd.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdXVlaWV2dnZ4YmdicXRranlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjU0NDksImV4cCI6MjA1NzQwMTQ0OX0.Epvz9faKK9ukFPnTCvcAJIKDDbKBjfcm_CXo8yaRYds',
  VITE_API_BASE_URL: 'http://go.lynx.fm:3500'
};

// Extend Window interface to include our environment
declare global {
  interface Window {
    ENV?: Partial<LynxEnv>;
  }
}

// Get environment variables with fallback to development values
export const getEnvVar = (key: keyof LynxEnv): string => {
  // Try to get from window.ENV first (production)
  const envValue = window.ENV?.[key];
  if (envValue) {
    return envValue;
  }

  // Try to get from import.meta.env (development)
  const viteValue = import.meta.env[key];
  if (viteValue) {
    return viteValue;
  }

  // Fallback to default value
  console.warn(`Using default value for ${key}. This should only happen in development.`);
  return defaultEnv[key];
};
