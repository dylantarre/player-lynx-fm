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

# Ensure we have default values if environment variables are not set
# Use empty defaults to avoid hardcoding secrets
SUPABASE_URL=${VITE_SUPABASE_URL:-""}
SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY:-""}
API_BASE_URL=${VITE_API_BASE_URL:-"https://go.lynx.fm:3500"}
DEFAULT_COLOR_SCHEME=${VITE_DEFAULT_COLOR_SCHEME:-"0"}  # Default to the cyan/sky theme (index 0)

# Safer way to truncate values that works in more shell environments
if [ ! -z "$SUPABASE_URL" ]; then
  SUPABASE_URL_DISPLAY="$(echo $SUPABASE_URL | cut -c 1-10)... (truncated)"
else
  SUPABASE_URL_DISPLAY="Not set"
fi

if [ ! -z "$SUPABASE_ANON_KEY" ]; then
  SUPABASE_ANON_KEY_DISPLAY="$(echo $SUPABASE_ANON_KEY | cut -c 1-10)... (truncated)"
else
  SUPABASE_ANON_KEY_DISPLAY="Not set"
fi

echo "Using the following values:"
echo " SUPABASE_URL: $SUPABASE_URL_DISPLAY"
echo " SUPABASE_ANON_KEY: $SUPABASE_ANON_KEY_DISPLAY"
echo " API_BASE_URL: $API_BASE_URL"

cat > $CONFIG_FILE << EOF
// This file is generated at runtime by the container
window.ENV = {
  VITE_SUPABASE_URL: "${SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY}",
  VITE_API_BASE_URL: "${API_BASE_URL}",
  VITE_DEFAULT_COLOR_SCHEME: "${DEFAULT_COLOR_SCHEME}"
};

// Also set LYNX_CONFIG for compatibility
window.LYNX_CONFIG = {
  VITE_SUPABASE_URL: "${SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY}",
  VITE_API_BASE_URL: "${API_BASE_URL}",
  VITE_DEFAULT_COLOR_SCHEME: "${DEFAULT_COLOR_SCHEME}"
};
EOF

echo "Config file created at $CONFIG_FILE"
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
    
    # Explicitly replace any hardcoded URLs with the correct one
    sed -i "s|http://go.lynx.fm:3500|$VITE_API_BASE_URL|g" $file
    sed -i "s|https://go.lynx.fm:3500|$VITE_API_BASE_URL|g" $file
  fi
done

echo "==================================================="
echo "Environment Debugging Information:"
echo "==================================================="
echo "Container hostname: $(hostname)"
echo "Container IP: $(hostname -i 2>/dev/null || echo 'Unable to determine IP')"
echo "DNS resolution for go.lynx.fm: $(getent hosts go.lynx.fm 2>/dev/null || echo 'Failed to resolve')"
echo "Curl test to API: $(curl -s -o /dev/null -w '%{http_code}' https://go.lynx.fm:3500/health 2>/dev/null || echo 'Failed to connect')"
echo "==================================================="

echo "Environment variable injection completed successfully"

# Start nginx
exec "$@"
