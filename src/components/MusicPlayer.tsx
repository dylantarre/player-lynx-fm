import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Play, Pause, Square, Shuffle, LogOut, SwatchBook as Swatch, User, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ColorSchemeContext } from '../App';
import { lynxApi } from '../lib/lynxApi';

type View = 'player' | 'profile';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    id: string;
    title: string;
    artist: string;
    url: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<{ email: string | undefined; created_at: string | undefined }>({
    email: undefined,
    created_at: undefined
  });
  const [currentView, setCurrentView] = useState<View>('player');
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null);
  const [recentTracks, setRecentTracks] = useState<string[]>([]);
  const [lowFreq, setLowFreq] = useState(0);
  const [midFreq, setMidFreq] = useState(0);
  const [highFreq, setHighFreq] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);
  const navigate = useNavigate();

  const colorSchemes = [
    {
      from: 'from-cyan-950',
      via: 'via-sky-950',
      to: 'to-slate-900',
      accent1: 'from-cyan-400/30',
      accent2: 'from-sky-400/30',
      accent3: 'from-blue-400/30'
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

  const changeColorScheme = () => {
    const currentIndex = colorSchemes.findIndex(
      scheme => scheme.from === colorScheme?.from
    );
    const nextIndex = (currentIndex + 1) % colorSchemes.length;
    setColorScheme(colorSchemes[nextIndex]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const playRandom = async () => {
    setIsLoading(true);
    try {
      // Keep track of attempts to avoid infinite loops
      let attempts = 0;
      let randomTrackId = null;
      
      // Try to get a different track than the current one and recent tracks
      do {
        randomTrackId = await lynxApi.getRandomTrackId();
        attempts++;
        
        // Prevent infinite loops if the server only has a few tracks
        // or if we've tried too many times
        if (attempts >= 5) break;
      } while (
        randomTrackId && 
        (
          (currentTrack && randomTrackId === currentTrack.id) || 
          recentTracks.includes(randomTrackId)
        )
      );
      
      if (randomTrackId) {
        console.log('Selected new random track:', randomTrackId);
        if (currentTrack && randomTrackId === currentTrack.id) {
          console.log('Same track selected again after multiple attempts');
        }
        
        // Add to recent tracks history
        if (currentTrack) {
          setRecentTracks(prev => {
            const updated = [currentTrack.id, ...prev].slice(0, 5); // Keep last 5 tracks
            console.log('Updated recent tracks history:', updated);
            return updated;
          });
        }
        
        await loadTrack(randomTrackId);
      } else {
        console.error('Failed to get random track');
      }
    } catch (error) {
      console.error('Error playing random track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrack = async (trackId: string) => {
    try {
      console.log('Loading track:', trackId);
      
      // Clean up previous object URL if it exists
      if (audioObjectUrl) {
        URL.revokeObjectURL(audioObjectUrl);
        setAudioObjectUrl(null);
      }

      // Fetch the track audio with authentication
      const audioBlob = await lynxApi.fetchTrackAudio(trackId);
      
      if (!audioBlob) {
        throw new Error('Failed to fetch audio');
      }
      
      console.log('Audio blob received, size:', audioBlob.size);
      
      // Create an object URL from the blob
      const objectUrl = URL.createObjectURL(audioBlob);
      setAudioObjectUrl(objectUrl);
      
      // Update current track info
      setCurrentTrack({
        id: trackId,
        title: trackId.charAt(0).toUpperCase() + trackId.slice(1).replace('!', ''),
        artist: 'Lynx FM',
        url: objectUrl
      });
      
      // Set the audio source and play
      if (audioRef.current) {
        console.log('Setting audio source and playing');
        audioRef.current.src = objectUrl;
        audioRef.current.load();
        
        // Use a small timeout to ensure the audio element has loaded the new source
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Audio playback started successfully');
                setIsPlaying(true);
              }).catch(error => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
              });
            }
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error loading track:', error);
    }
  };

  useEffect(() => {
    const checkServerHealth = async () => {
      const status = await lynxApi.healthCheck();
      setServerStatus(status);
    };
    
    checkServerHealth();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserData({
        email: user?.email,
        created_at: user?.created_at
      });
    };
    fetchUserData();
    
    // Get a random track on initial load
    playRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const average = (arr: Uint8Array) => {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  };

  // Animate background based on audio frequencies
  const startAnimation = useCallback(() => {
    if (!analyserRef.current) return;

    const animate = () => {
      const bufferLength = analyserRef.current!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current!.getByteFrequencyData(dataArray);

      // Calculate average frequency values for low, mid, and high ranges
      const lowFreq = average(dataArray.slice(0, 10));
      const midFreq = average(dataArray.slice(10, 20));
      const highFreq = average(dataArray.slice(20, 30));

      // Update CSS variables for animation with more subtle scaling
      if (document.documentElement) {
        // Store frequency values in component state for the circular elements
        setLowFreq(lowFreq);
        setMidFreq(midFreq);
        setHighFreq(highFreq);
        
        // Update morph background with more subtle effect
        document.documentElement.style.setProperty('--morph-scale-1', `${1 + (lowFreq / 512)}`)
        document.documentElement.style.setProperty('--morph-scale-2', `${1 + (midFreq / 512)}`)
        document.documentElement.style.setProperty('--morph-scale-3', `${1 + (highFreq / 512)}`)
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    };

    const handlePlay = () => {
      initAudioContext();
      startAnimation();
    };

    audio.addEventListener('play', handlePlay);
    return () => {
      audio.removeEventListener('play', handlePlay);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [startAnimation]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioObjectUrl) {
        URL.revokeObjectURL(audioObjectUrl);
      }
    };
  }, [audioObjectUrl]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme?.from} ${colorScheme?.via} ${colorScheme?.to} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Ethereal background effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${colorScheme.accent1} rounded-full filter blur-3xl animate-pulse-slow`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${colorScheme.accent2} rounded-full filter blur-3xl animate-pulse-slow delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${colorScheme.accent3} rounded-full filter blur-3xl animate-float`}></div>
      </div>
      
      {/* Color scheme button */}
      <button
        onClick={changeColorScheme}
        className={`absolute bottom-4 left-4 p-3 rounded-full bg-gradient-to-r ${colorScheme.from.replace('from-', 'from-')} ${colorScheme.via.replace('via-', 'to-')} text-white/70 hover:text-white transition-all shadow-elevated hover:shadow-elevated-hover backdrop-blur-sm hover:-translate-y-0.5 border border-white/20`}
        title="Change color scheme"
      >
        <Swatch className="w-5 h-5" />
      </button>

      {/* View toggle button */}
      <button
        onClick={() => setCurrentView(currentView === 'player' ? 'profile' : 'player')}
        className={`absolute bottom-4 right-4 p-3 rounded-full bg-gradient-to-r ${colorScheme.from.replace('from-', 'from-')} ${colorScheme.via.replace('via-', 'to-')} text-white/70 hover:text-white transition-all shadow-elevated hover:shadow-elevated-hover backdrop-blur-sm hover:-translate-y-0.5 border border-white/20`}
        title={currentView === 'player' ? 'View Profile' : 'View Player'}
      >
        {currentView === 'player' ? <User className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>
      
      <div className="max-w-md w-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl shadow-elevated overflow-hidden border border-white/20 transition-all hover:shadow-elevated-hover relative">
        {/* Morphing background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -inset-1/2 w-[200%] h-[200%] bg-gradient-to-br ${colorScheme.accent1} rounded-full filter blur-3xl opacity-30 scale-[var(--morph-scale-1)]`}></div>
        </div>
        
        {/* Player content */}
        <div className="relative z-10">
          {currentView === 'player' ? (
            <div className="p-8">
              <div className="text-center mb-12">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${colorScheme.accent1} ${colorScheme.accent3} animate-morph shadow-elevated`}
                  style={{ transform: `scale(${1 + (lowFreq / 512)})` }}
                ></div>
                <div 
                  className={`absolute inset-2 bg-gradient-to-br ${colorScheme.accent2} ${colorScheme.accent1} animate-morph-reverse shadow-elevated`}
                  style={{ transform: `scale(${1 + (midFreq / 512)})` }}
                ></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/15 to-transparent backdrop-blur-sm flex items-center justify-center shadow-elevated">
                  <div 
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorScheme.from.replace('from-', 'from-')}/80 ${colorScheme.via.replace('via-', 'to-')}/80 shadow-elevated`}
                    style={{ transform: `scale(${1 + (highFreq / 512)})` }}
                  ></div>
                </div>
              </div>
              <div className="uppercase tracking-wider text-sm text-teal-300 font-bold mb-2">
                Now Playing
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLoading ? 'Loading...' : (currentTrack?.title || 'Select a Track')}
              </h2>
              <p className="text-emerald-200/80 font-medium">
                {currentTrack?.artist || ''}
              </p>
              {serverStatus === false && (
                <p className="text-red-400 mt-2">Server connection error</p>
              )}
              </div>
            
              <div className="flex justify-center space-x-6">
              <button
                onClick={togglePlay}
                disabled={!currentTrack || isLoading}
                className={`p-4 rounded-full bg-gradient-to-r ${colorScheme.from.replace('from-', 'from-')}/80 ${colorScheme.via.replace('via-', 'to-')}/80 text-white hover:${colorScheme.from.replace('from-', 'from-')}/60 hover:${colorScheme.via.replace('via-', 'to-')}/60 transition-all shadow-elevated hover:shadow-elevated-hover backdrop-blur-sm hover:-translate-y-0.5 ${(!currentTrack || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>
              
              <button
                onClick={stopPlay}
                disabled={!currentTrack || isLoading}
                className={`p-4 rounded-full bg-gradient-to-r ${colorScheme.via.replace('via-', 'from-')}/80 ${colorScheme.to.replace('to-', 'to-')}/80 text-white hover:${colorScheme.via.replace('via-', 'from-')}/60 hover:${colorScheme.to.replace('to-', 'to-')}/60 transition-all shadow-elevated hover:shadow-elevated-hover backdrop-blur-sm hover:-translate-y-0.5 ${(!currentTrack || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Square className="w-8 h-8" />
              </button>
              
              <button
                onClick={playRandom}
                disabled={isLoading || serverStatus === false}
                className={`p-4 rounded-full bg-gradient-to-r ${colorScheme.from.replace('from-', 'from-')}/80 ${colorScheme.to.replace('to-', 'to-')}/80 text-white hover:${colorScheme.from.replace('from-', 'from-')}/60 hover:${colorScheme.to.replace('to-', 'to-')}/60 transition-all shadow-elevated hover:shadow-elevated-hover backdrop-blur-sm hover:-translate-y-0.5 ${(isLoading || serverStatus === false) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Shuffle className="w-8 h-8" />
                )}
              </button>
              </div>
              
              <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                src={currentTrack?.url || ''}
                preload="auto"
                onError={(e) => console.error('Audio error:', e)}
              />
            </div>
          ) : (
            <div className="p-8">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white/70 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/80 to-indigo-500/80 flex items-center justify-center shadow-elevated">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                  <div className="text-white font-medium">{userData.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Member Since</label>
                  <div className="text-white font-medium">
                    {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : ''}
                  </div>
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
          )}
        </div>
      </div>
    </div>
  );
}