# LynxFM Docker Deployment Guide

This guide explains how to build and deploy the LynxFM application using Docker, Portainer, or Digital Ocean App Platform.

## Prerequisites

- Docker installed on your build machine
- Access to a Portainer instance or Digital Ocean account
- Supabase account with API credentials

## Local Build and Test

1. Set up your environment variables by copying the example file:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your Supabase credentials.

3. Build the Docker image locally:

```bash
docker build -t lynx-fm:latest .
```

4. Run the container locally to test:

```bash
docker run -p 8080:80 \
  -e VITE_SUPABASE_URL=your_supabase_url \
  -e VITE_SUPABASE_ANON_KEY=your_supabase_anon_key \
  -e VITE_API_BASE_URL=http://go.lynx.fm:3500 \
  lynx-fm:latest
```

5. Access the application at http://localhost:8080

## Deploying to Portainer

### Option 1: Using Docker Compose

1. Upload your project files to your server or use Git to clone the repository.

2. In Portainer, navigate to Stacks > Add Stack.

3. Either upload the docker-compose.yml file or paste its contents.

4. Set the required environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_API_BASE_URL (if different from default)

5. Deploy the stack.

### Option 2: Using Docker Image

1. Build and push the Docker image to a registry:

```bash
docker build -t your-registry/lynx-fm:latest .
docker push your-registry/lynx-fm:latest
```

2. In Portainer, navigate to Containers > Add Container.

3. Configure the container:
   - Name: lynx-fm
   - Image: your-registry/lynx-fm:latest
   - Port mapping: 8080:80
   - Environment variables:
     - VITE_SUPABASE_URL=your_supabase_url
     - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     - VITE_API_BASE_URL=http://go.lynx.fm:3500 (if needed)

4. Deploy the container.

## Deploying to Digital Ocean App Platform

The Lynx FM Player can be easily deployed to Digital Ocean App Platform, which provides a simple way to host your application with automatic SSL, global CDN, and easy scaling.

### Prerequisites for Digital Ocean Deployment

1. A Digital Ocean account
2. Your code pushed to a GitHub repository
3. Supabase credentials (URL and Anonymous Key)

### Deployment Steps

1. Log in to your Digital Ocean account and navigate to the App Platform section.

2. Click "Create App" and select your GitHub repository.

3. Configure your app with the following settings:
   - Source Directory: `/` (root of the repository)
   - Build Command: `npm ci && npm run build`
   - Run Command: `npm start`

4. Add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key
   - `VITE_API_BASE_URL`: `http://go.lynx.fm:3500`

5. Choose your plan (Basic plan is sufficient for most use cases).

6. Click "Launch App" to deploy your application.

### Using the Configuration Files

This repository includes configuration files to make deployment easier:

- `.do/app.yaml`: Digital Ocean App Platform configuration
- `do-app.json`: Alternative configuration format for Digital Ocean CLI
- `serve.json`: Configuration for serving the static site with proper routing

You can use these files with the Digital Ocean CLI for automated deployments:

```bash
doctl apps create --spec .do/app.yaml
```

Note: Before using the configuration files, update the GitHub repository URL in the files to point to your repository.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Your Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Your Supabase anonymous key | Yes |
| VITE_API_BASE_URL | URL of the Go-Lynx server | No (defaults to http://go.lynx.fm:3500) |

## Security Notes

- **NEVER commit your .env file to version control**
- Use environment variables for all sensitive information
- The example docker-compose.yml contains placeholder values that should be replaced with your actual credentials
- For production deployments, consider using Docker secrets or a secure environment variable management system

## Notes

- The application is configured to run on port 80 inside the container
- The default exposed port is 8080, but you can change this in your deployment
- The application uses Nginx to serve the static files and handle SPA routing
- The container includes a health check that pings the root URL

## Deployment Configurations

- **Production**: Running at lynx.fm through Cloudflare tunnel (192.168.50.83:8080)
- **Local Development**: Running on localhost:5179 (Vite) or localhost:8080 (Docker)
- **API Server**: Always using go.lynx.fm:3500 for audio streaming
- **Deployment Pipeline Options**: 
  - GitHub → Portainer → lynx.fm
  - GitHub → Digital Ocean App Platform

## Troubleshooting

- If you encounter authentication issues, verify your Supabase environment variables
- For audio playback problems, check that the VITE_API_BASE_URL is correctly set and accessible from your deployment environment
- Check container logs for any startup errors: `docker logs lynx-fm`
