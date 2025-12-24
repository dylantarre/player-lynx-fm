import React from 'react';

interface ColorScheme {
  from: string;
  via: string;
  to: string;
  accent1: string;
  accent2: string;
  accent3: string;
}

interface WubbleProps {
  /** Low frequency value (0-255) - bass/drums */
  lowFreq?: number;
  /** Mid frequency value (0-255) - vocals/instruments */
  midFreq?: number;
  /** High frequency value (0-255) - treble/cymbals */
  highFreq?: number;
  /** Color scheme for gradients */
  colorScheme?: ColorScheme;
  /** Size of the Wubble (default: 128px) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const defaultColorScheme: ColorScheme = {
  from: 'from-pink-950',
  via: 'via-fuchsia-950',
  to: 'to-slate-900',
  accent1: 'from-cyan-400/30',
  accent2: 'from-teal-400/30',
  accent3: 'from-emerald-400/30',
};

export const Wubble: React.FC<WubbleProps> = ({
  lowFreq = 0,
  midFreq = 0,
  highFreq = 0,
  colorScheme = defaultColorScheme,
  size = 'lg',
}) => {
  const combinedFreq = (lowFreq + midFreq + highFreq) / (255 * 3);

  return (
    <div
      className={`relative ${sizeMap[size]} mx-auto`}
      style={{
        transform: `scale(${1 - (lowFreq / 920) * 0.38}) rotate(${(lowFreq / 920) * 2.5}deg)`,
      }}
    >
      {/* Outer morphing layer - responds to mid frequencies */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.accent1} ${colorScheme.accent3} animate-morph shadow-elevated`}
        style={{
          transform: `scale(${1 + (midFreq / 640) * 0.72}) rotate(${(midFreq / 920) * -4}deg)`,
        }}
      />

      {/* Middle morphing layer - responds to high frequencies */}
      <div
        className={`absolute inset-2 bg-gradient-to-br ${colorScheme.accent2} ${colorScheme.accent1} animate-morph-reverse shadow-elevated`}
        style={{
          transform: `scale(${1 + (highFreq / 780) * 0.52}) rotate(${(highFreq / 920) * 2}deg)`,
        }}
      />

      {/* Inner core - responds to combined frequencies */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/15 to-transparent backdrop-blur-sm flex items-center justify-center shadow-elevated">
        <div
          className={`w-1/2 h-1/2 rounded-full bg-gradient-to-br ${colorScheme.from.replace('from-', 'from-')}/80 ${colorScheme.via.replace('via-', 'to-')}/80 shadow-elevated`}
          style={{
            transform: `scale(${1 + combinedFreq * 0.32})`,
          }}
        />
      </div>
    </div>
  );
};

export default Wubble;
