import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PlayButton } from './PlayButton';

const meta: Meta<typeof PlayButton> = {
  title: 'Components/PlayButton',
  component: PlayButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'The primary playback control button that toggles between play and pause states. Features a gradient background, hover lift effect, and smooth icon transitions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isPlaying: {
      control: 'boolean',
      description: 'Controls which icon is displayed. When true, shows pause icon; when false, shows play icon.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button, reducing opacity and preventing interaction. Use when no track is loaded.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the button padding and icon size. Large is the default for the main player.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the button is clicked. Should toggle the playback state.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlayButton>;

export const Playing: Story = {
  args: {
    isPlaying: true,
    disabled: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'The button in its playing state, showing the pause icon. Click to pause playback.',
      },
    },
  },
};

export const Paused: Story = {
  args: {
    isPlaying: false,
    disabled: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'The button in its paused/stopped state, showing the play icon. Click to start playback.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    isPlaying: false,
    disabled: true,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state shown when no track is loaded or during loading. The button is faded and non-interactive.',
      },
    },
  },
};

// Interactive toggle demo
const InteractivePlayButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <PlayButton
        isPlaying={isPlaying}
        onClick={() => setIsPlaying(!isPlaying)}
        size="lg"
      />
      <span className="text-white/60 text-sm">
        {isPlaying ? 'Playing' : 'Paused'} - Click to toggle
      </span>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractivePlayButton />,
  parameters: {
    docs: {
      description: {
        story: 'A fully interactive demo. Click the button to toggle between play and pause states.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    isPlaying: false,
    disabled: false,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact size variant for mini players, list items, or tight UI spaces.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    isPlaying: false,
    disabled: false,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size variant for secondary player interfaces or mobile views.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    isPlaying: false,
    disabled: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant used in the main player. Provides a prominent, easy-to-tap target.',
      },
    },
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <PlayButton isPlaying={false} onClick={() => {}} size="sm" />
      <PlayButton isPlaying={false} onClick={() => {}} size="md" />
      <PlayButton isPlaying={false} onClick={() => {}} size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three size variants side by side for comparison. Use the appropriate size based on your UI context.',
      },
    },
  },
};

