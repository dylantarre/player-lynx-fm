import React, { useState } from 'react';
import { signIn, signUp } from '../lib/auth';
import { LogIn, UserPlus } from 'lucide-react';
import { LynxCat } from './LynxCat';

interface AuthProps {
  onAuthSuccess?: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess?.();
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-950 via-sky-950 to-slate-900 animate-gradient">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-400/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/30 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-rose-400/30 rounded-full filter blur-3xl animate-float"></div>
      </div>
      <div className="w-full max-w-md p-8 relative">
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <LynxCat className="w-10 h-10 text-amber-400" />
              <h1 className="text-3xl font-kaushan text-amber-400 text-center">lynx.fm</h1>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-white font-sans placeholder:font-sans placeholder-white/50 focus:outline-none focus:border-amber-400/50"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-white font-sans placeholder:font-sans placeholder-white/50 focus:outline-none focus:border-amber-400/50"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 rounded-xl font-sans font-bold hover:from-amber-300 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={loading}
              >
                {loading ? (
                  'Loading...'
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/70 hover:text-white transition-colors font-kaushan"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={async () => {
                setError(null);
                setLoading(true);
                try {
                  await signIn('demo@lynx.fm', 'demo123');
                  onAuthSuccess?.();
                  window.location.reload();
                } catch (err) {
                  if (err instanceof Error) {
                    setError(err.message);
                  } else {
                    setError('Demo login failed');
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full px-4 py-3 bg-white/10 text-white/70 rounded-xl font-sans hover:bg-white/20 hover:text-white focus:outline-none transition-all disabled:opacity-50"
              disabled={loading}
            >
              Try the Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
