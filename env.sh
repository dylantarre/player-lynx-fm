#!/bin/sh

# Create a config file with the environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.ENV = {
  VITE_SUPABASE_URL: '${VITE_SUPABASE_URL}',
  VITE_SUPABASE_ANON_KEY: '${VITE_SUPABASE_ANON_KEY}',
  VITE_API_BASE_URL: '${VITE_API_BASE_URL}'
};
EOF

# Start Nginx
exec nginx -g 'daemon off;'
