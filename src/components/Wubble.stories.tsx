import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Wubble } from './Wubble';

const meta: Meta<typeof Wubble> = {
  title: 'Components/Wubble',
  component: Wubble,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    lowFreq: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Low frequency (bass) - 0 to 255',
    },
    midFreq: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Mid frequency (vocals) - 0 to 255',
    },
    highFreq: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'High frequency (treble) - 0 to 255',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Wubble>;

// Default static state
export const Default: Story = {
  args: {
    lowFreq: 0,
    midFreq: 0,
    highFreq: 0,
    size: 'lg',
  },
};

// Interactive with controls
export const Interactive: Story = {
  args: {
    lowFreq: 128,
    midFreq: 100,
    highFreq: 80,
    size: 'lg',
  },
};

// Simulated audio visualization
const SimulatedAudioWubble = () => {
  const [lowFreq, setLowFreq] = useState(0);
  const [midFreq, setMidFreq] = useState(0);
  const [highFreq, setHighFreq] = useState(0);

  useEffect(() => {
    let frame: number;
    let time = 0;

    const animate = () => {
      time += 0.05;

      // Simulate different frequency bands with varying sine waves
      setLowFreq(Math.abs(Math.sin(time * 0.8) * 180 + Math.sin(time * 1.2) * 75));
      setMidFreq(Math.abs(Math.sin(time * 1.5) * 150 + Math.cos(time * 0.9) * 80));
      setHighFreq(Math.abs(Math.cos(time * 2) * 120 + Math.sin(time * 1.8) * 60));

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="p-8">
      <Wubble lowFreq={lowFreq} midFreq={midFreq} highFreq={highFreq} size="xl" />
      <div className="mt-8 text-white/60 text-sm text-center space-y-1">
        <div>Low: {Math.round(lowFreq)}</div>
        <div>Mid: {Math.round(midFreq)}</div>
        <div>High: {Math.round(highFreq)}</div>
      </div>
    </div>
  );
};

export const SimulatedAudio: Story = {
  render: () => <SimulatedAudioWubble />,
};

// Size variants
export const Small: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'xl',
  },
};

// Color scheme variants
const oceanColorScheme = {
  from: 'from-cyan-950',
  via: 'via-sky-950',
  to: 'to-slate-900',
  accent1: 'from-blue-400/30',
  accent2: 'from-indigo-400/30',
  accent3: 'from-violet-400/30',
};

const sunsetColorScheme = {
  from: 'from-orange-950',
  via: 'via-red-950',
  to: 'to-slate-900',
  accent1: 'from-yellow-400/30',
  accent2: 'from-orange-400/30',
  accent3: 'from-red-400/30',
};

const forestColorScheme = {
  from: 'from-green-950',
  via: 'via-emerald-950',
  to: 'to-slate-900',
  accent1: 'from-lime-400/30',
  accent2: 'from-green-400/30',
  accent3: 'from-teal-400/30',
};

export const OceanTheme: Story = {
  args: {
    lowFreq: 100,
    midFreq: 80,
    highFreq: 60,
    size: 'lg',
    colorScheme: oceanColorScheme,
  },
};

export const SunsetTheme: Story = {
  args: {
    lowFreq: 100,
    midFreq: 80,
    highFreq: 60,
    size: 'lg',
    colorScheme: sunsetColorScheme,
  },
};

export const ForestTheme: Story = {
  args: {
    lowFreq: 100,
    midFreq: 80,
    highFreq: 60,
    size: 'lg',
    colorScheme: forestColorScheme,
  },
};

// High energy state
export const HighEnergy: Story = {
  args: {
    lowFreq: 220,
    midFreq: 200,
    highFreq: 180,
    size: 'xl',
  },
};

// Calm state
export const Calm: Story = {
  args: {
    lowFreq: 30,
    midFreq: 25,
    highFreq: 20,
    size: 'xl',
  },
};
