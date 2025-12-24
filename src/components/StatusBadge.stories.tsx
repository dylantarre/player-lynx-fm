import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'A text-based status indicator that displays the current playback state. Uses uppercase styling with letter spacing for a refined, modern look. Includes ARIA attributes for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['playing', 'paused', 'stopped', 'loading'],
      description: 'The current playback status. Each status has a default display text.',
    },
    customText: {
      control: 'text',
      description: 'Override the default status text with custom content. Useful for localization or special states.',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Color variant for the badge. Default is teal, matching the player theme.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Playing: Story = {
  args: {
    status: 'playing',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Active playback state. The default "Now Playing" text indicates music is currently streaming.',
      },
    },
  },
};

export const Paused: Story = {
  args: {
    status: 'paused',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Paused state shown when playback is temporarily stopped but can be resumed from the current position.',
      },
    },
  },
};

export const Stopped: Story = {
  args: {
    status: 'stopped',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully stopped state. Playback position is reset to the beginning. Shown before any track is played or after explicit stop.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    status: 'loading',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state displayed while fetching a new track or buffering audio data.',
      },
    },
  },
};

export const CustomText: Story = {
  args: {
    status: 'playing',
    customText: 'Live Stream',
    variant: 'success',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom text for special content types like live streams, podcasts, or radio stations.',
      },
    },
  },
};

export const SuccessVariant: Story = {
  args: {
    status: 'playing',
    variant: 'success',
  },
  parameters: {
    docs: {
      description: {
        story: 'Success color variant in emerald green. Use for positive states or confirmations.',
      },
    },
  },
};

export const WarningVariant: Story = {
  args: {
    status: 'paused',
    customText: 'Low Quality',
    variant: 'warning',
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning color variant in amber. Use for attention-needed states like low bandwidth or buffering.',
      },
    },
  },
};

export const ErrorVariant: Story = {
  args: {
    status: 'stopped',
    customText: 'Connection Lost',
    variant: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error color variant in red. Use for error states like connection failures or playback errors.',
      },
    },
  },
};

// Animated state cycling demo
const AnimatedStatusBadge = () => {
  const statuses: Array<'playing' | 'paused' | 'stopped' | 'loading'> = [
    'loading',
    'playing',
    'paused',
    'stopped',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statuses.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <StatusBadge status={statuses[index]} />
      <span className="text-white/40 text-xs">Cycling through states every 2s</span>
    </div>
  );
};

export const AnimatedCycle: Story = {
  render: () => <AnimatedStatusBadge />,
  parameters: {
    docs: {
      description: {
        story: 'Demo cycling through all status states automatically. Shows how the badge transitions between different playback states.',
      },
    },
  },
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-center">
      <StatusBadge status="playing" variant="default" />
      <StatusBadge status="playing" variant="success" />
      <StatusBadge status="paused" variant="warning" />
      <StatusBadge status="stopped" variant="error" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All color variants displayed together for comparison. Choose the variant that best matches the semantic meaning of your status.',
      },
    },
  },
};
