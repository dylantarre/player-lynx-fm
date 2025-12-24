// Auth module for go-lynx authentication

interface WindowWithEnv extends Window {
  ENV?: { VITE_API_BASE_URL?: string };
  LYNX_CONFIG?: { VITE_API_BASE_URL?: string };
  VITE_API_BASE_URL?: string;
}

const getApiBaseUrl = (): string => {
  return (
    (window as WindowWithEnv).LYNX_CONFIG?.VITE_API_BASE_URL ||
    (window as WindowWithEnv).ENV?.VITE_API_BASE_URL ||
    (window as WindowWithEnv).VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'https://go.lynx.fm'
  );
};

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

const AUTH_TOKEN_KEY = 'lynx_auth_token';
const AUTH_USER_KEY = 'lynx_auth_user';

// Get stored auth state
export const getStoredAuth = (): AuthState => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

// Store auth state
export const storeAuth = (response: AuthResponse): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, response.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
};

// Clear auth state
export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

// Get auth token for API calls
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Sign up
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Sign up failed');
  }

  const data: AuthResponse = await response.json();
  storeAuth(data);
  return data;
};

// Sign in
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Sign in failed');
  }

  const data: AuthResponse = await response.json();
  storeAuth(data);
  return data;
};

// Sign out
export const signOut = (): void => {
  clearAuth();
  window.location.reload();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
