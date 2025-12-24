import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayButtonProps {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

const iconSizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  onClick,
  disabled = false,
  size = 'lg',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-r from-pink-950/80 to-fuchsia-950/80
        text-white
        hover:from-pink-950/60 hover:to-fuchsia-950/60
        transition-all
        shadow-elevated
        hover:shadow-elevated-hover
        backdrop-blur-sm
        hover:-translate-y-0.5
        border border-white/20
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
      `}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <Pause className={iconSizes[size]} />
      ) : (
        <Play className={iconSizes[size]} />
      )}
    </button>
  );
};

export default PlayButton;
