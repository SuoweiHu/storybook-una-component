import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Carousel } from './Carousel';

// Placeholder photos from Lorem Picsum; each seed always returns the same image.
const slides = [
  { image: 'https://picsum.photos/seed/una-campus/1280/720', alt: 'Placeholder photo 1' },
  { image: 'https://picsum.photos/seed/una-library/1280/720', alt: 'Placeholder photo 2' },
  { image: 'https://picsum.photos/seed/una-students/1280/720', alt: 'Placeholder photo 3' },
];

const meta = {
  title: 'Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    slides,
    label: 'Student stories',
    controls: 'bottom',
    autoplay: false,
    autoplayDelay: 5000,
    showAutoplayButton: true,
  },
  argTypes: {
    slides: {
      control: 'object',
      description: 'Each slide has an `image`, `alt` text, and an optional `href`.',
    },
  },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomControls: Story = {};

export const SideControls: Story = {
  args: { controls: 'side' },
};

export const SingleSlide: Story = {
  args: { slides: slides.slice(0, 1) },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
  },
};

export const NavigateWithPreviousAndNext: Story = {
  play: async ({ canvas, userEvent }) => {
    const previous = canvas.getByRole('button', { name: 'Previous' });
    const next = canvas.getByRole('button', { name: 'Next' });
    const bullet = (index: number) => canvas.getByRole('button', { name: new RegExp(`^Go to slide ${index}:`) });

    await expect(previous).toBeDisabled();
    await expect(bullet(1)).toHaveAttribute('aria-current', 'true');

    await userEvent.click(next);
    await waitFor(() => expect(bullet(2)).toHaveAttribute('aria-current', 'true'));
    await expect(previous).toBeEnabled();

    await userEvent.click(next);
    await waitFor(() => expect(next).toBeDisabled());

    await userEvent.click(bullet(1));
    await waitFor(() => expect(bullet(1)).toHaveAttribute('aria-current', 'true'));
  },
};

export const NavigateWithSideButtons: Story = {
  args: { controls: 'side' },
  play: async ({ canvas, userEvent }) => {
    const up = canvas.getByRole('button', { name: 'Previous slide' });
    const down = canvas.getByRole('button', { name: 'Next slide' });

    await expect(up).toBeDisabled();
    await userEvent.click(down);
    await waitFor(() => expect(up).toBeEnabled());
    await expect(canvas.getByRole('button', { name: /^Go to slide 2:/ })).toHaveAttribute('aria-current', 'true');
  },
};

export const Autoplaying: Story = {
  args: { autoplay: true },
};

export const ToggleAutoplay: Story = {
  args: { autoplayDelay: 500 },
  play: async ({ canvas, userEvent }) => {
    const bullet = (index: number) => canvas.getByRole('button', { name: new RegExp(`^Go to slide ${index}:`) });

    await userEvent.click(canvas.getByRole('button', { name: 'Play automatic slide show' }));
    const pause = await canvas.findByRole('button', { name: 'Pause automatic slide show' });
    await waitFor(() => expect(bullet(2)).toHaveAttribute('aria-current', 'true'), { timeout: 3000 });

    await userEvent.click(pause);
    await expect(await canvas.findByRole('button', { name: 'Play automatic slide show' })).toBeInTheDocument();
  },
};

export const WithoutAutoplayButton: Story = {
  args: { showAutoplayButton: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: /automatic slide show/ })).toBeNull();
  },
};
