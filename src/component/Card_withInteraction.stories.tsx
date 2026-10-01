import type { Meta, StoryObj } from '@storybook/react-vite';
import {Card_withInteraction} from './Card_withInteraction';

const meta = {
    title: "Example-4-Interaction/[4.a] Card with Interaction",
    component: Card_withInteraction,
    tags: ['!autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story)=>{
            return (
                <div className="w-200">
                    <Story />
                </div>
            )
        }
    ]
} satisfies Meta<typeof Card_withInteraction>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus_using_tab: Story = {
    play: async ({ canvas, userEvent  }) => {
        const hoverTarget = canvas.getByRole('hoverable-card');
        await userEvent.tab();
    },
};