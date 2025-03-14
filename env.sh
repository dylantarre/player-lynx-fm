#!/bin/sh

# Replace environment variables in the built app
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
  -e "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=${VITE_SUPABASE_URL}|g" \
  -e "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}|g" \
  -e "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=${VITE_API_BASE_URL}|g" \
  {} +

# Replace specific placeholders in the JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
  -e "s|import.meta.env.VITE_SUPABASE_URL|\"${VITE_SUPABASE_URL}\"|g" \
  -e "s|import.meta.env.VITE_SUPABASE_ANON_KEY|\"${VITE_SUPABASE_ANON_KEY}\"|g" \
  -e "s|import.meta.env.VITE_API_BASE_URL|\"${VITE_API_BASE_URL}\"|g" \
  {} +

# Start Nginx
exec nginx -g 'daemon off;'
