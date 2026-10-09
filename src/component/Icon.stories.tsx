import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Icon } from './Icon';
import { iconNames, iconVariants } from './icons';

const meta = {
  title: 'Icon',
  component: Icon,
  // Docs come from Icon.mdx, which adds the full icon gallery.
  tags: ['!autodocs'],
  args: {
    name: 'phone',
    variant: 'black',
    size: 48,
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    variant: { control: 'inline-radio', options: iconVariants },
    size: { control: { type: 'range', min: 12, max: 128, step: 4 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const img = canvasElement.querySelector('img');
    await expect(img).toHaveAttribute('aria-hidden', 'true');
    await expect(img).toHaveAttribute('alt', '');
  },
};

export const Gold: Story = {
  args: { name: 'sui-001', variant: 'gold' },
};

export const White: Story = {
  args: { name: 'linkedin', variant: 'white' },
  decorators: [(Story) => <div className="inline-block bg-black p-4"><Story /></div>],
};

export const Hero: Story = {
  args: { name: 'hi003-01', size: 96 },
};

export const WithLabel: Story = {
  args: { name: 'youtube', label: 'ANU on YouTube' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'ANU on YouTube' })).toBeVisible();
  },
};
