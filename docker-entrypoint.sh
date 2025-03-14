#!/bin/sh

# Read Docker secrets and export them as environment variables
[ -f /run/secrets/VITE_SUPABASE_URL ] && export VITE_SUPABASE_URL=$(cat /run/secrets/VITE_SUPABASE_URL)
[ -f /run/secrets/VITE_SUPABASE_ANON_KEY ] && export VITE_SUPABASE_ANON_KEY=$(cat /run/secrets/VITE_SUPABASE_ANON_KEY)
[ -f /run/secrets/VITE_API_BASE_URL ] && export VITE_API_BASE_URL=$(cat /run/secrets/VITE_API_BASE_URL)

# Substitute placeholders in index.html using envsubst
envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY} ${VITE_API_BASE_URL}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

# Start Nginx
exec nginx -g "daemon off;"
