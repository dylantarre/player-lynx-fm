import React from 'react';

interface TrackInfoProps {
  /** Track title */
  title: string;
  /** Artist name */
  artist?: string;
  /** Whether the track is loading */
  loading?: boolean;
  /** Placeholder text when no track is selected */
  placeholder?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const titleSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

const artistSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export const TrackInfo: React.FC<TrackInfoProps> = ({
  title,
  artist,
  loading = false,
  placeholder = 'Select a Track',
  align = 'center',
  size = 'lg',
}) => {
  const displayTitle = loading ? 'Loading...' : title || placeholder;

  return (
    <div className={alignClasses[align]}>
      <h2
        className={`${titleSizes[size]} text-white font-sans font-bold mb-1 ${
          loading ? 'animate-pulse' : ''
        }`}
      >
        {displayTitle}
      </h2>
      {artist && !loading && (
        <p className={`${artistSizes[size]} text-emerald-200/80 font-sans`}>
          {artist}
        </p>
      )}
      {loading && (
        <p className={`${artistSizes[size]} text-emerald-200/50 font-sans animate-pulse`}>
          Fetching track info...
        </p>
      )}
    </div>
  );
};

export default TrackInfo;
