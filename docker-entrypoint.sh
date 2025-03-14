#!/bin/sh

# Replace environment variables in index.html
envsubst "\${VITE_SUPABASE_URL} \${VITE_SUPABASE_ANON_KEY} \${VITE_API_BASE_URL}" < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

# Start Nginx
exec nginx -g "daemon off;"
