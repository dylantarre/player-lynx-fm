import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// (Optional) Log the build-time env variables to verify they are set
console.log('Build env:', process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, process.env.VITE_API_BASE_URL);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
