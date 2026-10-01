import type { Meta, StoryObj } from '@storybook/react-vite';
import {SimpleLoginForm} from './SimpleLoginForm';

const meta = {
    title: "Example-4-Interaction/[4.b] Form with Interaction",
    component: SimpleLoginForm,
    tags: ['!autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story)=>{
            return (
                <div className="w-md">
                    <Story />
                </div>
            )
        }
    ]
} satisfies Meta<typeof SimpleLoginForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithInappropriatePassword: Story = {
    play: async ({ args, canvas, step, userEvent  }) => {
        await step("Enter username (step-1)", async()=>{
            const input_user = canvas.getByLabelText('Username');
            userEvent.type(input_user, 'LOREM IPSUM USER');
        });
        setTimeout(async()=>{
            await step("Enter password (step-2) ", async()=>{
                const input_password = canvas.getByLabelText('Password');
                userEvent.type(input_password, 'Hello');
            });
        }, 500);
    },
};
export const WithAppropriatePassword: Story = {
    play: async ({ args, canvas, step, userEvent  }) => {
        await step("Enter username (step-1)", async()=>{
            const input_user = canvas.getByLabelText('Username');
            userEvent.type(input_user, 'LOREM IPSUM USER');
        });
        setTimeout(async()=>{
            await step("Enter password (step-2) ", async()=>{
                const input_password = canvas.getByLabelText('Password');
                userEvent.type(input_password, 'GoodPassword123');
            });
        }, 500);
    },
};
export const WithEnteredThenDeletedPassword: Story = {
    play: async ({ args, canvas, step, userEvent  }) => {
        await step("Enter username (step-1)", async()=>{
            const input_user = canvas.getByLabelText('Username');
            userEvent.type(input_user, 'LOREM IPSUM USER');
        });
        setTimeout(async()=>{
            await step("Enter password (step-2) ", async()=>{
                const input_password = canvas.getByLabelText('Password');
                await userEvent.type(input_password, 'GoodPassword123');
                userEvent.clear(input_password);
            });
        }, 500);
    },
};

