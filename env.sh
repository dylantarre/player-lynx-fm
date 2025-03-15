#!/bin/sh

# Replace environment variables in the built app
# This script runs at container startup to inject environment variables

# The directory containing the built app
APP_DIR=/usr/share/nginx/html

# Print configuration information for debugging
echo "==================================================="
echo "LynxFM Configuration Check"
echo "==================================================="
if [ ! -z "$VITE_SUPABASE_URL" ]; then
  echo " VITE_SUPABASE_URL is set to: $VITE_SUPABASE_URL"
else
  echo " VITE_SUPABASE_URL is NOT SET"
fi

if [ ! -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo " VITE_SUPABASE_ANON_KEY is set"
else
  echo " VITE_SUPABASE_ANON_KEY is NOT SET"
fi

if [ ! -z "$VITE_API_BASE_URL" ]; then
  echo " VITE_API_BASE_URL is set to: $VITE_API_BASE_URL"
else
  echo " VITE_API_BASE_URL is NOT SET"
fi
echo "==================================================="

# Create a config.js file with the environment variables
echo "Updating config.js with environment values..."
CONFIG_FILE="$APP_DIR/config.js"

cat > $CONFIG_FILE << EOF
// This file is generated at runtime by the container
window.ENV = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY}",
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
};
EOF

echo " Configuration file updated successfully"
echo "==================================================="

# List files in the app directory for debugging
echo "Files in $APP_DIR:"
ls -la $APP_DIR
echo "==================================================="

# Find all JS files
find $APP_DIR -type f -name "*.js" | while read -r file; do
  # Replace environment variables
  echo "Processing: $file"
  
  # Replace VITE_SUPABASE_URL
  if [ ! -z "$VITE_SUPABASE_URL" ]; then
    sed -i "s|VITE_SUPABASE_URL_PLACEHOLDER|$VITE_SUPABASE_URL|g" $file
    sed -i "s|\"VITE_SUPABASE_URL\"|\"$VITE_SUPABASE_URL\"|g" $file
  fi
  
  # Replace VITE_SUPABASE_ANON_KEY
  if [ ! -z "$VITE_SUPABASE_ANON_KEY" ]; then
    sed -i "s|VITE_SUPABASE_ANON_KEY_PLACEHOLDER|$VITE_SUPABASE_ANON_KEY|g" $file
    sed -i "s|\"VITE_SUPABASE_ANON_KEY\"|\"$VITE_SUPABASE_ANON_KEY\"|g" $file
  fi
  
  # Replace VITE_API_BASE_URL if needed
  if [ ! -z "$VITE_API_BASE_URL" ]; then
    sed -i "s|VITE_API_BASE_URL_PLACEHOLDER|$VITE_API_BASE_URL|g" $file
    sed -i "s|\"VITE_API_BASE_URL\"|\"$VITE_API_BASE_URL\"|g" $file
  fi
done

# Start nginx
exec "$@"
