import React from 'react';
import { Square, Shuffle, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';

type IconType = 'stop' | 'shuffle' | 'previous' | 'next' | 'volume' | 'favorite';

interface ControlButtonProps {
  /** Icon to display */
  icon: IconType;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Whether the button is in an active/toggled state */
  active?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label */
  ariaLabel?: string;
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

const iconComponents: Record<IconType, typeof Square> = {
  stop: Square,
  shuffle: Shuffle,
  previous: SkipBack,
  next: SkipForward,
  volume: Volume2,
  favorite: Heart,
};

export const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  loading = false,
  active = false,
  size = 'lg',
  ariaLabel,
}) => {
  const IconComponent = iconComponents[icon];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-r from-fuchsia-950/80 to-slate-900/80
        text-white
        hover:from-fuchsia-950/60 hover:to-slate-900/60
        transition-all
        shadow-elevated
        hover:shadow-elevated-hover
        backdrop-blur-sm
        hover:-translate-y-0.5
        border border-white/20
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        ${active ? 'ring-2 ring-white/40' : ''}
      `}
      aria-label={ariaLabel || icon}
      aria-pressed={active}
    >
      {loading ? (
        <div
          className={`${iconSizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}
        />
      ) : (
        <IconComponent className={`${iconSizes[size]} ${active ? 'fill-current' : ''}`} />
      )}
    </button>
  );
};

export default ControlButton;
