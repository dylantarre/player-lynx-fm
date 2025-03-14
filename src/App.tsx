import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import { MusicPlayer } from './components/MusicPlayer';
import { useEffect, useState, Suspense, createContext } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

export const ColorSchemeContext = createContext({
  colorScheme: {
    from: 'from-indigo-950',
    via: 'via-purple-900',
    to: 'to-slate-900',
    accent1: 'from-amber-400/30',
    accent2: 'from-orange-400/30',
    accent3: 'from-yellow-400/30'
  },
  setColorScheme: (scheme: any) => {}
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [colorScheme, setColorScheme] = useState({
    from: 'from-indigo-950',
    via: 'via-purple-900',
    to: 'to-slate-900',
    accent1: 'from-amber-400/30',
    accent2: 'from-orange-400/30',
    accent3: 'from-yellow-400/30'
  });

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
