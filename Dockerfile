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

# Build the application with ARGs that will be used during build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE_URL
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to replace env variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env.sh && \
    echo 'echo "window.ENV = {" > /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env.sh && \
    echo 'echo "  VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env.sh && \
    echo 'echo "  VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env.sh && \
    echo 'echo "  VITE_API_BASE_URL: \"$VITE_API_BASE_URL\"" >> /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env.sh && \
    chmod +x /docker-entrypoint.d/40-env.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
