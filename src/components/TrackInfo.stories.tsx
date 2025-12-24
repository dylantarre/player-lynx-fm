import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrackInfo } from './TrackInfo';

const meta: Meta<typeof TrackInfo> = {
  title: 'Components/TrackInfo',
  component: TrackInfo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'Displays the current track title and artist name. Handles loading states gracefully with animated placeholders and supports different sizes and alignments for various layout contexts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The track title to display. Falls back to placeholder when empty.',
    },
    artist: {
      control: 'text',
      description: 'The artist name. Hidden when empty or during loading state.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading animation with placeholder text while fetching track data.',
    },
    placeholder: {
      control: 'text',
      description: 'Text shown when no track title is provided. Defaults to "Select a Track".',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment within the component.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the font sizes for title and artist.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TrackInfo>;

export const Default: Story = {
  args: {
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    loading: false,
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard track display with title and artist. This is the typical state when a track is playing.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    title: '',
    artist: '',
    loading: true,
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state shown while fetching track information. Both title and artist show pulsing placeholder text.',
      },
    },
  },
};

export const NoTrack: Story = {
  args: {
    title: '',
    artist: '',
    loading: false,
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state before any track is selected. Shows the placeholder text prompting user action.',
      },
    },
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Untitled Track',
    artist: '',
    loading: false,
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Track with title but no artist information. The artist line is hidden rather than showing empty space.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This Is an Extremely Long Track Title That Might Need to Wrap',
    artist: 'Artist With a Really Long Name Too',
    loading: false,
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'How the component handles long text. Consider adding text truncation if this is a concern for your layout.',
      },
    },
  },
};

export const LeftAligned: Story = {
  args: {
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    loading: false,
    align: 'left',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Left-aligned variant for horizontal layouts or list views.',
      },
    },
  },
};

export const RightAligned: Story = {
  args: {
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    loading: false,
    align: 'right',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Right-aligned variant for RTL layouts or specific design requirements.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    loading: false,
    align: 'center',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact size for mini players, notifications, or list items.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    loading: false,
    align: 'center',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size for secondary player views or mobile interfaces.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    loading: false,
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size used in the main player interface. Provides maximum readability and visual impact.',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    title: '',
    artist: '',
    loading: false,
    placeholder: 'Tap shuffle to discover music',
    align: 'center',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom placeholder text for specific onboarding or instructional contexts.',
      },
    },
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <TrackInfo title="Small Size" artist="Artist Name" size="sm" />
      <TrackInfo title="Medium Size" artist="Artist Name" size="md" />
      <TrackInfo title="Large Size" artist="Artist Name" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All size variants displayed together for comparison.',
      },
    },
  },
};
