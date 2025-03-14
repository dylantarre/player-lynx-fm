import { supabase } from './supabase';

// Use the Nginx proxy for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

// API Response Types
interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverArt?: string;
}

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Helper function to handle fetch errors
async function fetchWithErrorHandling(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Unknown error occurred',
        status: response.status
      }));
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API fetch error:', error);
    throw new Error('Network error when connecting to Lynx API. Please check your connection and try again.');
  }
}

// Get the auth token for API requests
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.access_token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// API client for Go-Lynx server
export const lynxApi = {
  // Public endpoints (no auth required)
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetchWithErrorHandling(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async getRandomTrackId(): Promise<string | null> {
    try {
      console.log('Fetching random track ID...');
      const response = await fetchWithErrorHandling(`${API_BASE_URL}/random`);
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
      const response = await fetchWithErrorHandling(`${API_BASE_URL}/me`, {
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
    return `${API_BASE_URL}/tracks/${trackId}`;
  },

  async prefetchTracks(trackIds: string[]): Promise<PrefetchResponse | null> {
    const token = await getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    try {
      console.log('Prefetching tracks:', trackIds);
      const response = await fetchWithErrorHandling(`${API_BASE_URL}/prefetch`, {
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

  async fetchTrackAudio(trackId: string): Promise<Blob | null> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetchWithErrorHandling(`${API_BASE_URL}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return await response.blob();
  },

  async fetchTrackMetadata(trackId: string): Promise<TrackMetadata> {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetchWithErrorHandling(`${API_BASE_URL}/tracks/${trackId}/metadata`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return await response.json();
  },

  async createAuthenticatedAudioSource(trackId: string): Promise<{ url: string; token: string | null }> {
    const token = await getAuthToken();
    
    return {
      url: `${API_BASE_URL}/tracks/${trackId}`,
      token
    };
  }
};
