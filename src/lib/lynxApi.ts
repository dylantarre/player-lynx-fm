import { supabase } from './supabase';

// Define a type for the global window with ENV property
interface WindowWithEnv extends Window {
  ENV?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
    VITE_API_BASE_URL?: string;
  };
}

// Try to get environment variables from window.ENV first (for production)
// then fall back to import.meta.env (for development)
const API_BASE_URL = ((window as WindowWithEnv).ENV?.VITE_API_BASE_URL) || import.meta.env.VITE_API_BASE_URL || 'https://go.lynx.fm';

// Helper function to ensure proper URL construction
const buildUrl = (path: string): string => {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  try {
    // Make sure the API_BASE_URL is valid
    let baseUrl = API_BASE_URL;
    
    // Ensure the base URL has a protocol
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }
    
    // Ensure the base URL ends with a slash for proper path joining
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    
    // For debugging
    console.log('Building URL with base:', baseUrl, 'and path:', cleanPath);
    
    // Create a URL object to properly handle URL construction
    const url = new URL(cleanPath, baseUrl);
    return url.toString();
  } catch (error) {
    console.error('Error building URL:', error);
    
    // Fallback method for URL construction
    let baseUrl = API_BASE_URL;
    
    // Ensure the base URL has a protocol
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }
    
    // Ensure the base URL ends with a slash for proper path joining
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    
    return baseUrl + cleanPath;
  }
};

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

// Get the JWT token from Supabase
const getAuthToken = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};

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
      console.log('Random track ID received:', data.track_id);
      return data.track_id;
    } catch (error) {
      console.error('Failed to get random track:', error);
      return null;
    }
  },

  // Protected endpoints (auth required)
  async getUserInfo(): Promise<UserInfo | null> {
    const token = await getAuthToken();
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
    const token = await getAuthToken();
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
    const token = await getAuthToken();
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
  async createAuthenticatedAudioSource(trackId: string): Promise<{ url: string; token: string | null }> {
    const token = await getAuthToken();
    
    return {
      url: buildUrl(`/tracks/${trackId}`),
      token
    };
  }
};
