import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ControlButton } from './ControlButton';

const meta: Meta<typeof ControlButton> = {
  title: 'Components/ControlButton',
  component: ControlButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'A versatile control button for secondary player actions like stop, shuffle, skip, and volume. Features gradient background, hover effects, loading state, and active toggle state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['stop', 'shuffle', 'previous', 'next', 'volume', 'favorite'],
      description: 'The icon to display. Each icon represents a specific player action.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button, preventing interaction and reducing opacity.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinning loader instead of the icon. Use during async operations like fetching a new track.',
    },
    active: {
      control: 'boolean',
      description: 'Indicates a toggled-on state with a ring highlight. Use for shuffle mode, repeat, or favorites.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls button padding and icon size.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the button is clicked.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ControlButton>;

export const Stop: Story = {
  args: {
    icon: 'stop',
    disabled: false,
    loading: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Stop button to halt playback and reset to the beginning of the track.',
      },
    },
  },
};

export const Shuffle: Story = {
  args: {
    icon: 'shuffle',
    disabled: false,
    loading: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shuffle button to play a random track. In lynx.fm, this fetches a random track from the server.',
      },
    },
  },
};

export const Previous: Story = {
  args: {
    icon: 'previous',
    disabled: false,
    loading: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Skip to previous track in the queue or playlist.',
      },
    },
  },
};

export const Next: Story = {
  args: {
    icon: 'next',
    disabled: false,
    loading: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Skip to next track in the queue or playlist.',
      },
    },
  },
};

export const Volume: Story = {
  args: {
    icon: 'volume',
    disabled: false,
    loading: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Volume control button. Could toggle mute or open a volume slider.',
      },
    },
  },
};

export const Favorite: Story = {
  args: {
    icon: 'favorite',
    disabled: false,
    loading: false,
    active: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Favorite/heart button to like or save a track. Toggle the active state to show it\'s favorited.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    icon: 'shuffle',
    disabled: false,
    loading: true,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinning indicator. Shown while fetching a new random track or performing async operations.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    icon: 'stop',
    disabled: true,
    loading: false,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state when the action is not available, such as stop when no track is loaded.',
      },
    },
  },
};

export const Active: Story = {
  args: {
    icon: 'shuffle',
    disabled: false,
    loading: false,
    active: true,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Active/toggled state with ring highlight. Use for modes that stay on, like shuffle or repeat.',
      },
    },
  },
};

// Interactive toggle demo
const InteractiveControlButton = () => {
  const [active, setActive] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <ControlButton
        icon="favorite"
        onClick={() => setActive(!active)}
        active={active}
        size="lg"
      />
      <span className="text-white/60 text-sm">
        {active ? 'Favorited' : 'Not favorited'} - Click to toggle
      </span>
    </div>
  );
};

export const InteractiveToggle: Story = {
  render: () => <InteractiveControlButton />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing the toggle behavior. Click to switch between active and inactive states.',
      },
    },
  },
};

// All icons comparison
export const AllIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ControlButton icon="previous" onClick={() => {}} size="lg" />
      <ControlButton icon="stop" onClick={() => {}} size="lg" />
      <ControlButton icon="next" onClick={() => {}} size="lg" />
      <ControlButton icon="shuffle" onClick={() => {}} size="lg" />
      <ControlButton icon="volume" onClick={() => {}} size="lg" />
      <ControlButton icon="favorite" onClick={() => {}} size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available icons displayed together. Use these to build a complete player control bar.',
      },
    },
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ControlButton icon="shuffle" onClick={() => {}} size="sm" />
      <ControlButton icon="shuffle" onClick={() => {}} size="md" />
      <ControlButton icon="shuffle" onClick={() => {}} size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All size variants for the same icon. Choose based on your UI density requirements.',
      },
    },
  },
};
