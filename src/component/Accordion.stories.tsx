import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Accordion } from './Accordion';

// Plain strings so the items can be edited in the Storybook "items" control.
const items = [
  {
    title: 'Who can I talk to if I have more questions after Open Day?',
    content: 'Talk to our Future Student Enquiry team about your study options, application process, support services or campus life. Call 1800 620 032 or submit an online enquiry.',
  },
  {
    title: 'View our catalogue of short videos',
    content: 'Browse short videos covering study areas, student life and our campus.',
  },
  {
    title: 'Visit campus',
    content: 'Book a campus tour or explore the grounds at your own pace.',
  },
  {
    title: 'Find us on social media',
    content: 'Follow us for the latest news, events and student stories.',
  },
];

const meta = {
  title: 'Accordion',
  component: Accordion,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    items,
    theme: 'light',
    allowMultiple: false,
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Each item has a `title` and `content`. Edit, add or remove items here.',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  decorators: [(Story) => <div className="bg-white p-16"><Story /></div>],
};

export const Opened: Story = {
  args: { defaultOpen: [0] },
  decorators: [(Story) => <div className="bg-white p-16"><Story /></div>],
};

export const Cream: Story = {
  args: { defaultOpen: [0] },
  decorators: [(Story) => <div className="bg-anu-primary-200 p-16"><Story /></div>],
};

export const Dark: Story = {
  args: { theme: 'dark', defaultOpen: [0] },
  decorators: [(Story) => <div className="bg-black p-16"><Story /></div>],
};

export const Grey: Story = {
  args: { theme: 'grey', defaultOpen: [0] },
  decorators: [(Story) => <div className="bg-anu-grey-100 p-16"><Story /></div>],
};

export const AllowMultiple: Story = {
  args: { allowMultiple: true, defaultOpen: [0, 2] },
  decorators: [(Story) => <div className="bg-white p-16"><Story /></div>],
};

export const ToggleOpenAndClose: Story = {
  decorators: [(Story) => <div className="bg-white p-16"><Story /></div>],
  play: async ({ canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Visit campus' });
    const panel = canvasElement.ownerDocument.getElementById(button.getAttribute('aria-controls') ?? '');
    await expect(panel).not.toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(panel).toBeVisible());

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(panel).not.toBeVisible());
  },
};
