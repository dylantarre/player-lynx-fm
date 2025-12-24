import React from 'react';

type PlaybackStatus = 'playing' | 'paused' | 'stopped' | 'loading';

interface StatusBadgeProps {
  /** Current playback status */
  status: PlaybackStatus;
  /** Custom status text (overrides default) */
  customText?: string;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const statusText: Record<PlaybackStatus, string> = {
  playing: 'Now Playing',
  paused: 'Paused',
  stopped: 'Stopped',
  loading: 'Loading...',
};

const variantClasses = {
  default: 'text-teal-300',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  error: 'text-red-300',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customText,
  variant = 'default',
}) => {
  const displayText = customText || statusText[status];

  return (
    <div
      className={`uppercase tracking-wider text-sm font-sans font-bold ${variantClasses[variant]}`}
      role="status"
      aria-live="polite"
    >
      {displayText}
    </div>
  );
};

export default StatusBadge;
