# Use Node.js LTS version based on Alpine Linux for a smaller footprint
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to replace config values at runtime with detailed logging
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-config.sh && \
    echo 'echo "==================================================="' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "LynxFM Configuration Check"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "==================================================="' >> /docker-entrypoint.d/40-config.sh && \
    echo 'if [ -n "$VITE_SUPABASE_URL" ]; then' >> /docker-entrypoint.d/40-config.sh && \
    echo '  echo " VITE_SUPABASE_URL is set to: ${VITE_SUPABASE_URL}"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'else' >> /docker-entrypoint.d/40-config.sh && \
    echo '  echo " VITE_SUPABASE_URL is NOT SET"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'fi' >> /docker-entrypoint.d/40-config.sh && \
    echo 'if [ -n "$VITE_SUPABASE_ANON_KEY" ]; then' >> /docker-entrypoint.d/40-config.sh && \
    echo '  echo " VITE_SUPABASE_ANON_KEY is set"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'else' >> /docker-entrypoint.d/40-config.sh && \
    echo '  echo " VITE_SUPABASE_ANON_KEY is NOT SET"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'fi' >> /docker-entrypoint.d/40-config.sh && \
    echo 'if [ -n "$VITE_API_BASE_URL" ]; then' >> /docker-entrypoint.d/40-config.sh && \
    echo '  echo " VITE_API_BASE_URL is set to: ${VITE_API_BASE_URL}"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'else' >> /docker-entrypoint.d/40-config.sh && \
    echo '  echo " VITE_API_BASE_URL is not set, using default: /api"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'fi' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "==================================================="' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "Updating config.js with environment values..."' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "// LynxFM Configuration - Generated at $(date)" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "window.LYNX_CONFIG = {" >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "  supabaseUrl: \"${VITE_SUPABASE_URL:-https://fpuueievvvxbgbqtkjyd.supabase.co}\"," >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "  supabaseAnonKey: \"${VITE_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdXVlaWV2dnZ4YmdicXRranlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwNTU1MzYsImV4cCI6MjAyNjYzMTUzNn0.OqJEJiuXsqgxPpGQBdEgLGQu2KoUSZeK-ETLJzxqaqM}\"," >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "  apiBaseUrl: \"${VITE_API_BASE_URL:-/api}\"" >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo " Configuration file updated successfully"' >> /docker-entrypoint.d/40-config.sh && \
    echo 'echo "==================================================="' >> /docker-entrypoint.d/40-config.sh && \
    chmod +x /docker-entrypoint.d/40-config.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
