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
    docs: {
      description: {
        component: 'An organic, audio-reactive visualization element that morphs and pulses in response to audio frequency data. The Wubble consists of layered gradients that independently react to bass, mid-range, and treble frequencies, creating a fluid, living visual.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    lowFreq: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Controls the bass/drum response. Higher values cause the outer container to compress and rotate slightly, simulating the punch of low-end frequencies.',
    },
    midFreq: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Controls the mid-range response for vocals and instruments. Affects the outer morphing layer, making it expand and counter-rotate.',
    },
    highFreq: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Controls the treble/cymbal response. Drives the inner morphing layer with subtle scaling and rotation for shimmer effects.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Sets the overall dimensions of the Wubble. Sizes range from 64px (sm) to 192px (xl).',
    },
    colorScheme: {
      description: 'Defines the gradient colors for each layer. Includes accent colors for the morphing layers and base colors for the inner core.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Wubble>;

export const Default: Story = {
  args: {
    lowFreq: 0,
    midFreq: 0,
    highFreq: 0,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'The Wubble at rest with no audio input. The base morphing animation still runs, but without any frequency-driven scaling or rotation.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    lowFreq: 128,
    midFreq: 100,
    highFreq: 80,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the Controls panel to manually adjust each frequency band and see how the Wubble responds. Try maxing out lowFreq to see the bass compression effect.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'A live demo using simulated audio data. Sine waves at different frequencies drive each band, creating a continuous organic animation that mimics real music reactivity.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact 64px variant, ideal for tight spaces like list items or secondary UI elements.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Mid-sized 96px variant, balanced for sidebars or smaller player interfaces.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard 128px variant used in the main music player. Good balance of visibility and space.',
      },
    },
  },
};

export const ExtraLarge: Story = {
  args: {
    lowFreq: 80,
    midFreq: 60,
    highFreq: 40,
    size: 'xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero-sized 192px variant for landing pages or fullscreen visualizer modes.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Cool blue and indigo palette evoking ocean depths. Works well with ambient, electronic, or chill music genres.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Warm orange and red palette inspired by golden hour. Pairs naturally with upbeat, energetic, or warm acoustic tracks.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Natural green and teal palette with an earthy feel. Complements folk, nature sounds, or meditative audio.',
      },
    },
  },
};

export const HighEnergy: Story = {
  args: {
    lowFreq: 220,
    midFreq: 200,
    highFreq: 180,
    size: 'xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Maximum intensity state simulating a loud, bass-heavy drop. All layers are fully expanded and rotating at peak values.',
      },
    },
  },
};

export const Calm: Story = {
  args: {
    lowFreq: 30,
    midFreq: 25,
    highFreq: 20,
    size: 'xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal activity state for quiet passages or ambient music. Subtle movement keeps the visualization alive without being distracting.',
      },
    },
  },
};
