import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import { MusicPlayer } from './components/MusicPlayer';
import { useEffect, useState, Suspense, createContext } from 'react';
import { getStoredAuth, isAuthenticated, User } from './lib/auth';

// Get default color scheme from environment
declare global {
  interface Window {
    ENV?: {
      VITE_DEFAULT_COLOR_SCHEME?: string;
      VITE_API_BASE_URL?: string;
    };
  }
}

const defaultColorSchemeIndex = parseInt(window.ENV?.VITE_DEFAULT_COLOR_SCHEME || '0', 10);

// Define all available color schemes
const colorSchemeOptions = [
  {
    from: 'from-cyan-950',
    via: 'via-sky-950',
    to: 'to-slate-900',
    accent1: 'from-fuchsia-400/30',
    accent2: 'from-pink-400/30',
    accent3: 'from-rose-400/30'
  },
  {
    from: 'from-fuchsia-950',
    via: 'via-purple-950',
    to: 'to-slate-900',
    accent1: 'from-lime-400/30',
    accent2: 'from-emerald-400/30',
    accent3: 'from-teal-400/30'
  },
  {
    from: 'from-emerald-950',
    via: 'via-green-950',
    to: 'to-slate-900',
    accent1: 'from-pink-400/30',
    accent2: 'from-rose-400/30',
    accent3: 'from-red-400/30'
  },
  {
    from: 'from-indigo-950',
    via: 'via-blue-950',
    to: 'to-slate-900',
    accent1: 'from-yellow-400/30',
    accent2: 'from-amber-400/30',
    accent3: 'from-orange-400/30'
  },
  {
    from: 'from-violet-950',
    via: 'via-indigo-950',
    to: 'to-slate-900',
    accent1: 'from-emerald-400/30',
    accent2: 'from-green-400/30',
    accent3: 'from-lime-400/30'
  }
];

// Get the default color scheme based on the index
const getDefaultColorScheme = () => {
  const index = Math.min(Math.max(defaultColorSchemeIndex, 0), colorSchemeOptions.length - 1);
  return colorSchemeOptions[index];
};

interface ColorScheme {
  from: string;
  via: string;
  to: string;
  accent1: string;
  accent2: string;
  accent3: string;
}

export const ColorSchemeContext = createContext({
  colorScheme: getDefaultColorScheme(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setColorScheme: (_scheme: ColorScheme) => {}
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [colorScheme, setColorScheme] = useState(getDefaultColorScheme());

  useEffect(() => {
    // Check for existing auth
    const { user } = getStoredAuth();
    setUser(user);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-950 via-sky-950 to-slate-900 animate-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-400/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/30 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-rose-400/30 rounded-full filter blur-3xl animate-float"></div>
        </div>
        <div className="text-white/70 text-xl font-kaushan relative z-10">Loading...</div>
      </div>
    );
  }

  const authenticated = isAuthenticated();

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      <div className="transition-colors duration-1000">
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/login"
                element={authenticated ? <Navigate to="/player" /> : <Auth />}
              />
              <Route
                path="/player"
                element={authenticated ? <MusicPlayer /> : <Navigate to="/login" />}
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </ColorSchemeContext.Provider>
  );
}

export default App;
