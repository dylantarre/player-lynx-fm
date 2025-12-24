import type { Meta, StoryObj } from '@storybook/react-vite';
import { LynxCat } from './LynxCat';

const meta: Meta<typeof LynxCat> = {
  title: 'Components/LynxCat',
  component: LynxCat,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Tailwind CSS classes for sizing and color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LynxCat>;

export const Default: Story = {
  args: {
    className: 'w-8 h-8 text-amber-400',
  },
};

export const Large: Story = {
  args: {
    className: 'w-24 h-24 text-amber-400',
  },
};

export const Cyan: Story = {
  args: {
    className: 'w-16 h-16 text-cyan-400',
  },
};

export const Pink: Story = {
  args: {
    className: 'w-16 h-16 text-pink-400',
  },
};
