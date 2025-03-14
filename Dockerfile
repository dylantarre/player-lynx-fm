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

# Create an env-config.js file that will be included in the build
RUN echo "window.__env = {" > public/env-config.js && \
    echo "  VITE_SUPABASE_URL: '${VITE_SUPABASE_URL}'," >> public/env-config.js && \
    echo "  VITE_SUPABASE_ANON_KEY: '${VITE_SUPABASE_ANON_KEY}'," >> public/env-config.js && \
    echo "  VITE_API_BASE_URL: '${VITE_API_BASE_URL:-/api}'," >> public/env-config.js && \
    echo "};" >> public/env-config.js

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy environment setup script
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
