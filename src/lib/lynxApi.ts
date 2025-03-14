import { supabase } from './supabase';

// Use direct API URL for development, or the config value for production
const API_BASE_URL = window.LYNX_CONFIG?.apiBaseUrl || '/api';

console.log('Using API base URL:', API_BASE_URL);

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
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, just use the status message
      }
      
      console.error('API response error:', errorMessage, response.status);
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    console.error('API fetch error:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error when connecting to Lynx API. Please check your connection and try again.');
    }
    throw error;
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
      console.log(`Checking API health at: ${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Health check response:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error('Health check failed with status:', response.status, errorText);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Health check failed with exception:', error);
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
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log(`Fetching audio for track: ${trackId}`);
      
      const response = await fetchWithErrorHandling(`${API_BASE_URL}/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'audio/mpeg, audio/mp3, audio/*'
        }
      });
      
      // Check response headers
      const contentType = response.headers.get('content-type');
      console.log(`Audio response content-type: ${contentType}`);
      
      // Check response status
      console.log(`Audio response status: ${response.status}`);
      
      // Get the blob
      const blob = await response.blob();
      console.log(`Audio blob size: ${blob.size} bytes, type: ${blob.type}`);
      
      return blob;
    } catch (error) {
      console.error('Error fetching track audio:', error);
      return null;
    }
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
