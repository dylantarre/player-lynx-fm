import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Load env variables from secrets directory for Portainer compatibility
const loadSecretsDir = (dir: string) => {
  const env: Record<string, string> = {};
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isFile()) {
        try {
          env[file] = fs.readFileSync(filePath, 'utf-8').trim();
        } catch (error) {
          console.warn(`Error reading ${filePath}:`, error);
        }
      }
    });
  }
  return env;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env files
  const env = {
    ...loadEnv(mode, process.cwd()),
    // Load from secrets directory for Portainer compatibility
    ...loadSecretsDir('secrets')
  };

  // Define environment variable fallbacks for development
  const envWithFallbacks = {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || '',
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || '/api'
  };

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Make env variables available in the app
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(envWithFallbacks.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(envWithFallbacks.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(envWithFallbacks.VITE_API_BASE_URL)
    }
  };
});
