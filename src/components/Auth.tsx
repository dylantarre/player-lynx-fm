import React, { useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Cat } from 'lucide-react';
import { ColorSchemeContext } from '../App';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { colorScheme } = useContext(ColorSchemeContext);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme.from} ${colorScheme.via} ${colorScheme.to} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Ethereal background effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${colorScheme.accent1} rounded-full filter blur-3xl animate-pulse-slow`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${colorScheme.accent2} rounded-full filter blur-3xl animate-pulse-slow delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${colorScheme.accent3} rounded-full filter blur-3xl animate-float`}></div>
      </div>
      
      <div className="max-w-md w-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl shadow-elevated overflow-hidden border border-white/20 transition-all hover:shadow-elevated-hover p-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cat className="w-8 h-8 text-teal-300 mt-0.5" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
            {isSignUp ? 'Create Account' : 'lynx.fm'}
          </h2>
        </div>
        <p className="text-center text-amber-200/60 mb-8 text-sm font-medium">
          {isSignUp ? 'Sign up to start listening' : 'Welcome back'}
        </p>
        <form onSubmit={handleAuth} className="space-y-6 max-w-sm mx-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-200/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl shadow-elevated text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-200/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl shadow-elevated text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/80 to-yellow-500/80 text-white hover:from-amber-400 hover:to-yellow-400 transition-all shadow-elevated hover:shadow-elevated-hover backdrop-blur-sm hover:-translate-y-0.5 font-medium"
            >
              {loading ? (
                'Loading...'
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2 text-white" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2 text-white" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-amber-300 hover:text-yellow-300 transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}