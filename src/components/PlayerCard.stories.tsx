import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerCard } from './PlayerCard';

const meta: Meta<typeof PlayerCard> = {
  title: 'Components/PlayerCard',
  component: PlayerCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'A glassmorphic card container with frosted glass effect and optional animated background glow. Used as the main container for the music player interface.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showGlow: {
      control: 'boolean',
      description:
        'Toggles the morphing background glow effect. The glow responds to audio frequencies via CSS custom properties when used with the Wubble.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the card container.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlayerCard>;

export const Default: Story = {
  args: {
    showGlow: true,
    children: (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white font-bold mb-2">Player Card</h2>
        <p className="text-white/60">Content goes here</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default PlayerCard with glow effect enabled. The frosted glass appearance comes from the backdrop-blur and semi-transparent background gradient.',
      },
    },
  },
};

export const WithoutGlow: Story = {
  args: {
    showGlow: false,
    children: (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white font-bold mb-2">No Glow</h2>
        <p className="text-white/60">Cleaner look without the background effect</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'PlayerCard with the glow effect disabled. Use this variant when you want a cleaner appearance or when performance is a concern.',
      },
    },
  },
};

export const WithContent: Story = {
  args: {
    showGlow: true,
    children: (
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400/30 to-teal-400/30" />
          <div className="uppercase tracking-wider text-sm text-teal-300 font-bold mb-2">
            Now Playing
          </div>
          <h2 className="text-2xl text-white font-bold mb-1">Track Title</h2>
          <p className="text-emerald-200/80">Artist Name</p>
        </div>
        <div className="flex justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="w-12 h-12 rounded-full bg-white/10" />
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of a PlayerCard with typical music player content layout including album art placeholder, track info, and control buttons.',
      },
    },
  },
};

const oceanColorScheme = {
  from: 'from-cyan-950',
  via: 'via-sky-950',
  to: 'to-slate-900',
  accent1: 'from-blue-400/30',
  accent2: 'from-indigo-400/30',
  accent3: 'from-violet-400/30',
};

export const OceanTheme: Story = {
  args: {
    showGlow: true,
    colorScheme: oceanColorScheme,
    children: (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white font-bold mb-2">Ocean Theme</h2>
        <p className="text-white/60">Cool blue glow effect</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'PlayerCard with a cool ocean-inspired color scheme. The glow takes on the accent colors from the provided colorScheme prop.',
      },
    },
  },
};

const sunsetColorScheme = {
  from: 'from-orange-950',
  via: 'via-red-950',
  to: 'to-slate-900',
  accent1: 'from-yellow-400/30',
  accent2: 'from-orange-400/30',
  accent3: 'from-red-400/30',
};

export const SunsetTheme: Story = {
  args: {
    showGlow: true,
    colorScheme: sunsetColorScheme,
    children: (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white font-bold mb-2">Sunset Theme</h2>
        <p className="text-white/60">Warm orange glow effect</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'PlayerCard with a warm sunset-inspired color scheme. Great for energetic or upbeat music interfaces.',
      },
    },
  },
};
