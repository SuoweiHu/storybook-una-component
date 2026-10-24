import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
    title: 'Component/Link',
    component: Link,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        background: {
            name: 'Background',
            control: { type: 'radio' },
            options: ['light', 'dark'],
            description: 'Background color for the link preview.',
            required: true,
        },
        children: {
            control: 'text',
            name: 'Link text',
            description: 'Link text.',
            required: true,
        },
        href: {
            control: 'text',
            name: 'Link URL',
            description: 'Link URL.'
        },
    },
    args: {
        children: 'ANU Reporter newsletter',
        href: 'https://www.google.com/search?q=storybook',
        background: 'light',
    },
    // wrapper (to emulate light/dark background) for the storybook preview
    decorators: [
        (Story, { args }) => (
            <div className={args.background === 'dark' ? 'bg-anu-neutral-950 p-4' : 'bg-white p-4'}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = { args: { background: 'light' } };
export const Dark: Story  = { args: { background: 'dark' }  };
