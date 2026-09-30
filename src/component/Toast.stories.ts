import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta = {
  title: 'Example-2-Component/[2.a]-Toast-with-Variants',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    title: "Success",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, dignissimos.",
    type: "success"
  },
};

export const Warning: Story = {
  args: {
    title: "Warning",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, dignissimos.",
    type: "warning"
  },
};

export const Error: Story = {
  args: {
    title: "Error",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, dignissimos.",
    type: "error"
  },
};