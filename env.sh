#!/bin/sh

# Replace environment variables in the built app
# This script runs at container startup to inject environment variables

# The directory containing the built app
APP_DIR=/usr/share/nginx/html

# Create a temporary file to store environment variables
env_file="$APP_DIR/env-config.js"

# Create or update the env-config.js file
echo "window.__env = {" > $env_file
echo "  VITE_SUPABASE_URL: '${VITE_SUPABASE_URL:-}'," >> $env_file
echo "  VITE_SUPABASE_ANON_KEY: '${VITE_SUPABASE_ANON_KEY:-}'," >> $env_file
echo "  VITE_API_BASE_URL: '${VITE_API_BASE_URL:-"/api"}'," >> $env_file
echo "};" >> $env_file

# Find all JS files and update them
find $APP_DIR -type f -name "*.js" -o -name "*.html" | while read -r file; do
  echo "Processing: $file"
  
  # For HTML files, inject the env-config.js script
  if [[ "$file" == *.html ]]; then
    sed -i 's|</head>|<script src="/env-config.js"></script></head>|g' "$file"
  fi
done

echo "Environment variables have been injected"

# Start nginx
exec "$@"
