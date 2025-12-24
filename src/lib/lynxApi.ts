import { getAuthToken } from './auth';

// Define a type for the global window with ENV property
interface WindowWithEnv extends Window {
  ENV?: { VITE_API_BASE_URL?: string };
  LYNX_CONFIG?: { VITE_API_BASE_URL?: string };
  VITE_API_BASE_URL?: string;
}

// Try to get environment variables from various sources
const API_BASE_URL =
  ((window as WindowWithEnv).LYNX_CONFIG?.VITE_API_BASE_URL) ||
  ((window as WindowWithEnv).ENV?.VITE_API_BASE_URL) ||
  (window as WindowWithEnv).VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://go.lynx.fm';

console.log('📱 LynxFM API Base URL:', API_BASE_URL);

// Helper function to ensure proper URL construction
function buildUrl(path: string): string {
  const apiBaseUrl = (window as WindowWithEnv).ENV?.VITE_API_BASE_URL ||
                    (window as WindowWithEnv).LYNX_CONFIG?.VITE_API_BASE_URL ||
                    (window as WindowWithEnv).VITE_API_BASE_URL ||
                    import.meta.env.VITE_API_BASE_URL ||
                    'https://go.lynx.fm';

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl.replace(/\/$/, '')}${normalizedPath}`;
}

// Define types
export interface Track {
  id: string;
  title: string;
  artist: string;
}

export interface PrefetchResponse {
  valid_track_ids: string[];
  invalid_track_ids: string[] | null;
}

export interface UserInfo {
  email: string;
  id: string;
  role: string;
}

// Re-export getAuthToken from auth module
export { getAuthToken };

// API client for Go-Lynx server
export const lynxApi = {
  // Public endpoints (no auth required)
  async healthCheck(): Promise<boolean> {
    try {
      console.log('Checking server health...');
      const response = await fetch(buildUrl('/health'));
      const isHealthy = response.ok;
      console.log('Server health status:', isHealthy);
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async getRandomTrackId(): Promise<string | null> {
    try {
      console.log('Fetching random track ID...');
      const response = await fetch(buildUrl('/random'));
      if (!response.ok) {
        throw new Error(`Failed to get random track: ${response.status}`);
      }
      const data = await response.json();
      console.log('Random track ID received:', data.id);
      return data.id;
    } catch (error) {
      console.error('Failed to get random track:', error);
      return null;
    }
  },

  // Protected endpoints (auth required)
  async getUserInfo(): Promise<UserInfo | null> {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    try {
      console.log('Fetching user info...');
      const response = await fetch(buildUrl('/me'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`);
      }
      
      const userInfo = await response.json();
      console.log('User info received:', userInfo);
      return userInfo;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  },

  async getTrackUrl(trackId: string): Promise<string> {
    // This returns the URL to the track, which will require authentication when accessed
    return buildUrl(`/tracks/${trackId}`);
  },

  async prefetchTracks(trackIds: string[]): Promise<PrefetchResponse | null> {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    try {
      console.log('Prefetching tracks:', trackIds);
      const response = await fetch(buildUrl('/prefetch'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ track_ids: trackIds })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to prefetch tracks: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Prefetch result:', result);
      return result;
    } catch (error) {
      console.error('Failed to prefetch tracks:', error);
      return null;
    }
  },

  // Helper method to fetch track audio with authentication
  async fetchTrackAudio(trackId: string): Promise<Blob | null> {
    console.log(`Fetching audio for track: ${trackId}`);
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required');
    }
    
    try {
      console.log(`Making authenticated request to ${buildUrl(`/tracks/${trackId}`)}`);
      console.log(`Using token: ${token.substring(0, 10)}...`);
      
      const response = await fetch(buildUrl(`/tracks/${trackId}`), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with status ${response.status}: ${errorText}`);
        throw new Error(`Failed to fetch track audio: ${response.status} - ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log(`Received response with content type: ${contentType}`);
      
      const blob = await response.blob();
      console.log(`Received blob of size: ${blob.size} bytes and type: ${blob.type}`);
      return blob;
    } catch (error) {
      console.error('Failed to fetch track audio:', error);
      return null;
    }
  },

  // Helper method to create an authenticated audio source
  createAuthenticatedAudioSource(trackId: string): { url: string; token: string | null } {
    const token = getAuthToken();
    const trackUrl = buildUrl(`/tracks/${trackId}`);
    
    console.log(`Creating authenticated audio source for track ${trackId}`);
    console.log(`Track URL: ${trackUrl}`);
    
    return {
      url: trackUrl,
      token
    };
  }
};
