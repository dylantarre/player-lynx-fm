import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { getStoredAuth } from '../lib/auth';

export function Profile() {
  const navigate = useNavigate();
  const { user } = getStoredAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/player')}
          className="mb-8 flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Player
        </button>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-elevated border border-white/20 p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/80 to-indigo-500/80 flex items-center justify-center shadow-elevated">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
              <div className="text-white font-medium">{user?.email || 'Unknown'}</div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                  <span className="text-white">Enable notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                  <span className="text-white">Auto-play next track</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
