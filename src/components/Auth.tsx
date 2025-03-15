import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus } from 'lucide-react';
import { LynxCat } from './LynxCat';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        alert(error.message);
      } else {
        alert('An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-950 via-purple-950 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-lime-400/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/30 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/30 rounded-full filter blur-3xl animate-float"></div>
      </div>

      <div className="max-w-md w-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl shadow-elevated overflow-hidden border border-white/20 transition-all hover:shadow-elevated-hover relative">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <LynxCat className="w-10 h-10 text-amber-400" />
              <h1 className="text-3xl font-kaushan text-amber-400 text-center">lynx.fm</h1>
            </div>
            <h2 className="text-2xl text-white font-semibold mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-white/60">{isSignUp ? 'Sign up to start listening' : 'Sign in to continue listening'}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 rounded-xl font-medium hover:from-amber-300 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
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
              className="text-white/70 hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}