import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { LogOut, SwatchBook as Swatch, User, Music } from 'lucide-react';
import { signOut, getStoredAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { ColorSchemeContext } from '../App';
import { lynxApi } from '../lib/lynxApi';
import { LynxCat } from './LynxCat';
import { Wubble } from './Wubble';
import { PlayerCard } from './PlayerCard';
import { PlayButton } from './PlayButton';
import { ControlButton } from './ControlButton';
import { StatusBadge } from './StatusBadge';
import { TrackInfo } from './TrackInfo';

type View = 'player' | 'profile';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
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
      from: 'from-pink-950',
      via: 'via-fuchsia-950',
      to: 'to-slate-900',
      accent1: 'from-cyan-400/30',
      accent2: 'from-teal-400/30',
      accent3: 'from-emerald-400/30'
    },
    {
      from: 'from-cyan-950',
      via: 'via-sky-950',
      to: 'to-slate-900',
      accent1: 'from-fuchsia-400/30',
      accent2: 'from-pink-400/30',
      accent3: 'from-rose-400/30'
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

  const handleColorSchemeChange = () => {
    const currentIndex = colorSchemes.findIndex(
      (scheme) =>
        scheme.from === colorScheme.from &&
        scheme.via === colorScheme.via &&
        scheme.to === colorScheme.to
    );
    const nextIndex = (currentIndex + 1) % colorSchemes.length;
    const nextScheme = colorSchemes[nextIndex];
    setColorScheme(nextScheme);
  };

  const handleLogout = () => {
    signOut();
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
        setIsStopped(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsStopped(true);
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
                setIsStopped(false);
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
    const fetchUserData = () => {
      const { user } = getStoredAuth();
      setUserData({
        email: user?.email,
        created_at: undefined
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

      // Update CSS variables for animation with varied scaling and rotation
      if (document.documentElement) {
        // Store frequency values in component state for the circular elements
        setLowFreq(lowFreq);
        setMidFreq(midFreq);
        setHighFreq(highFreq);
        
        // Update morph background with varied effects
        document.documentElement.style.setProperty('--morph-scale-1', `${1 + (lowFreq / 640) * 0.72}`)
        document.documentElement.style.setProperty('--morph-scale-2', `${1 + (midFreq / 780) * 0.52}`)
        document.documentElement.style.setProperty('--morph-scale-3', `${1 + (highFreq / 920) * 0.32}`)
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
    <div className={`relative min-h-screen bg-gradient-to-br ${colorScheme.from} ${colorScheme.via} ${colorScheme.to} animate-gradient transition-colors-smooth bg-gradient overflow-hidden`}>
      {/* Ethereal background effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${colorScheme.accent1} rounded-full filter blur-3xl animate-pulse-slow transition-gradient`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${colorScheme.accent2} rounded-full filter blur-3xl animate-pulse-slow delay-1000 transition-gradient`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${colorScheme.accent3} rounded-full filter blur-3xl animate-float transition-gradient`}></div>
      </div>

      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LynxCat className="w-8 h-8 text-amber-400" />
            <span className="text-2xl text-amber-400 font-kaushan">lynx.fm</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-white/70 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <button
        onClick={handleColorSchemeChange}
        className="absolute bottom-4 left-4 text-white/70 hover:text-white transition-all"
        title="Change color scheme"
      >
        <Swatch className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentView(currentView === 'player' ? 'profile' : 'player')}
        className="absolute bottom-4 right-4 text-white/70 hover:text-white transition-all"
        title={currentView === 'player' ? 'View Profile' : 'View Player'}
      >
        {currentView === 'player' ? <User className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>

      <div className="flex items-center justify-center min-h-screen p-4">
        <PlayerCard colorScheme={colorScheme}>
            {currentView === 'player' ? (
              <div className="p-8">
                <div className="text-center mb-12">
                  <div className="mb-8">
                    <Wubble
                      lowFreq={lowFreq}
                      midFreq={midFreq}
                      highFreq={highFreq}
                      colorScheme={colorScheme}
                      size="lg"
                    />
                  </div>
                  <div className="mb-2">
                    <StatusBadge
                      status={isPlaying ? 'playing' : isStopped ? 'stopped' : 'paused'}
                    />
                  </div>
                  <TrackInfo
                    title={currentTrack?.title || ''}
                    artist={currentTrack?.artist}
                    loading={isLoading}
                  />
                  {serverStatus === false && (
                    <p className="text-red-400 mt-2">Server connection error</p>
                  )}
                </div>

                <div className="flex justify-center space-x-6">
                  <PlayButton
                    isPlaying={isPlaying}
                    onClick={togglePlay}
                    disabled={!currentTrack || isLoading}
                  />

                  <ControlButton
                    icon="stop"
                    onClick={stopPlay}
                    disabled={!currentTrack || isLoading}
                    ariaLabel="Stop"
                  />

                  <ControlButton
                    icon="shuffle"
                    onClick={playRandom}
                    disabled={isLoading || serverStatus === false}
                    loading={isLoading}
                    ariaLabel="Play random track"
                  />
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
                    <label className="block text-sm font-sans font-medium text-white/60 mb-2">Email</label>
                    <div className="text-white font-sans">{userData.email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-white/60 mb-2">Member Since</label>
                    <div className="text-white font-sans">
                      {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-lg font-sans font-semibold text-white mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                        <span className="text-white font-sans">Enable notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded bg-white/10 border-white/20" />
                        <span className="text-white font-sans">Auto-play next track</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </PlayerCard>
      </div>
    </div>
  );
}