import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import { MusicPlayer } from './components/MusicPlayer';
import { useEffect, useState, Suspense, createContext } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

// Get default color scheme from environment
declare global {
  interface Window {
    ENV?: {
      VITE_DEFAULT_COLOR_SCHEME?: string;
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      <div className="transition-colors duration-1000">
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/login"
                element={user ? <Navigate to="/player" /> : <Auth />}
              />
              <Route
                path="/player"
                element={user ? <MusicPlayer /> : <Navigate to="/login" />}
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
