import type { Meta, StoryObj } from '@storybook/react-vite';
import { MusicPlayer } from './MusicPlayer';

const meta: Meta<typeof MusicPlayer> = {
  title: 'Components/MusicPlayer',
  component: MusicPlayer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MusicPlayer>;

export const Default: Story = {};
