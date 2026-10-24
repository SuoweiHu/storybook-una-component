import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TailwindPlayDemo } from './TailwindPlayDemo';

const meta = {
  title: 'Reference Component/TailwindPlayDemo',
  component: TailwindPlayDemo,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TailwindPlayDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /read the docs/i })).toHaveAttribute(
      'href',
      'https://tailwindcss.com/docs'
    );
  },
};
