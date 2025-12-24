import React from 'react';

interface ColorScheme {
  from: string;
  via: string;
  to: string;
  accent1: string;
  accent2: string;
  accent3: string;
}

interface PlayerCardProps {
  /** Content to render inside the card */
  children: React.ReactNode;
  /** Color scheme for the morphing background effect */
  colorScheme?: ColorScheme;
  /** Whether to show the morphing background glow */
  showGlow?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const defaultColorScheme: ColorScheme = {
  from: 'from-pink-950',
  via: 'via-fuchsia-950',
  to: 'to-slate-900',
  accent1: 'from-cyan-400/30',
  accent2: 'from-teal-400/30',
  accent3: 'from-emerald-400/30',
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  children,
  colorScheme = defaultColorScheme,
  showGlow = true,
  className = '',
}) => {
  return (
    <div
      className={`max-w-md w-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl shadow-elevated overflow-hidden border border-white/20 transition-all hover:shadow-elevated-hover relative ${className}`}
    >
      {/* Morphing background glow effect */}
      {showGlow && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -inset-1/2 w-[200%] h-[200%] bg-gradient-to-br ${colorScheme.accent1} rounded-full filter blur-3xl opacity-30 scale-[var(--morph-scale-1)]`}
          />
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PlayerCard;
