# LynxFM Docker Deployment Guide

This guide explains how to build and deploy the LynxFM application using Docker and Portainer.

## Prerequisite

- Docker installed on your build machine
- Access to a Portainer instance
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

## Environment Variables

LynxFM requires the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_API_BASE_URL`: API base URL (defaults to `/api`)

### Setting Environment Variables in Portainer

1. In your Portainer stack configuration, add the environment variables under the "Environment" section:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_BASE_URL=/api
   ```

2. These variables will be injected into the container at runtime and used to generate the `config.js` file.

3. You can verify the environment variables are loaded correctly by checking the container logs after deployment.

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

## Troubleshooting

- If you encounter authentication issues, verify your Supabase environment variables
- For audio playback problems, check that the VITE_API_BASE_URL is correctly set and accessible from your deployment environment
- Check container logs for any startup errors: `docker logs lynx-fm`
