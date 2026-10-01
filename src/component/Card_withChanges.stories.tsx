import type { Meta, StoryObj } from '@storybook/react-vite';
import {Card_withChanges} from './Card_withChanges';

const meta = {
    title: "Example-5-Visual-Regression/[5.a] Card with Changes",
    component: Card_withChanges,
    tags: ['!autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="bg-gray-400 w-screen h-screen flex items-center justify-center  ">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Card_withChanges>;
export default meta;

type Story = StoryObj<typeof meta>;

export const LightPrimary: Story = {
    args: {
        title: "Study at ANU",
        href: "#",
        variant: "light-primary"
    }
};
export const LightSecondary: Story = {
    args: {
        title: "Study at ANU",
        href: "#",
        variant: "light-secondary"
    }
};
export const DarkPrimary: Story = {
    args: {
        title: "Study at ANU",
        href: "#",
        variant: "dark-primary"
    }
};
export const DarkSecondary: Story = {
    args: {
        title: "Study at ANU",
        href: "#",
        variant: "dark-secondary"
    }
};
