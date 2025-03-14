#!/bin/sh

# Replace environment variables in the built app
# This script runs at container startup to inject environment variables

# The directory containing the built app
APP_DIR=/usr/share/nginx/html

# Find all JS files
find $APP_DIR -type f -name "*.js" | while read -r file; do
  # Replace environment variables
  echo "Processing: $file"
  
  # Replace VITE_SUPABASE_URL
  if [ ! -z "$VITE_SUPABASE_URL" ]; then
    sed -i "s|VITE_SUPABASE_URL_PLACEHOLDER|$VITE_SUPABASE_URL|g" $file
  fi
  
  # Replace VITE_SUPABASE_ANON_KEY
  if [ ! -z "$VITE_SUPABASE_ANON_KEY" ]; then
    sed -i "s|VITE_SUPABASE_ANON_KEY_PLACEHOLDER|$VITE_SUPABASE_ANON_KEY|g" $file
  fi
  
  # Replace VITE_API_BASE_URL if needed
  if [ ! -z "$VITE_API_BASE_URL" ]; then
    sed -i "s|http://go.lynx.fm:3500|$VITE_API_BASE_URL|g" $file
  fi
done

# Start nginx
exec "$@"
