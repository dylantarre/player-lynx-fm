#!/bin/sh

# This script injects environment variables into the static env.js file
# It runs when the container starts

# The directory containing the built app
APP_DIR=/usr/share/nginx/html

# Update env.js with actual environment variables
if [ -f "$APP_DIR/env.js" ]; then
  echo "Injecting environment variables into env.js..."
  
  # Make a copy of the original file
  cp "$APP_DIR/env.js" "$APP_DIR/env.js.template"
  
  # Replace placeholders with actual values
  cat "$APP_DIR/env.js.template" | \
    sed "s|__SUPABASE_URL__|${VITE_SUPABASE_URL:-}|g" | \
    sed "s|__SUPABASE_ANON_KEY__|${VITE_SUPABASE_ANON_KEY:-}|g" | \
    sed "s|__API_BASE_URL__|${VITE_API_BASE_URL:-/api}|g" > "$APP_DIR/env.js"
  
  echo "Environment variables successfully injected"
else
  echo "Warning: $APP_DIR/env.js not found"
fi

# Start nginx
exec "$@"
