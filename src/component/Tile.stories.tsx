import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Tile } from './Tile';

const meta = {
  title: 'Tile',
  component: Tile,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    title: 'Pay period cut-off dates',
    href: '#pay-period-cut-off-dates',
    variant: 'headline',
  },
  argTypes: {
    image: { control: 'text', description: "Image URL, used by the 'overlay' and 'overlap' variants." },
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headline: Story = {
  decorators: [(Story) => <div className="max-w-72"><Story /></div>],
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /Pay period cut-off dates/ });
    await expect(link).toHaveAttribute('href', '#pay-period-cut-off-dates');
  },
};

export const Overlay: Story = {
  args: {
    title: 'Bandalang Studio',
    href: '#bandalang-studio',
    variant: 'overlay',
    // Placeholder photo from Lorem Picsum; the seed keeps it the same between reloads.
    image: 'https://picsum.photos/seed/una-studio/766/430',
  },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};

export const Overlap: Story = {
  args: {
    title: 'Programs',
    href: '#programs',
    variant: 'overlap',
    image: 'https://picsum.photos/seed/una-programs/766/430',
  },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};