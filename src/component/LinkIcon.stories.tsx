import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkIcon } from './LinkIcon';

const meta = {
    title: 'Component/LinkIcon',
    component: LinkIcon,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        icon: {
            name: 'Icon',
            control: { type: 'inline-radio' },
            options: ['external', 'download', 'lock'],
            description: 'Which icon to draw.',
            required: true,
        },
        textColor: {
            name: 'Icon color (text color)',
            control: { type: 'color' },
            description: 'Text color for the icon (the SVG is drawn in `currentColor`).',
            required: false,
        }
    },
    args: {
        icon: 'external',
    },
    decorators: [
        (Story, {args}) => (
            // The SVG is drawn in `currentColor`, so the wrapper supplies the text colour it inherits.
            <div className="bg-white p-4 text-blue-600" style={args.textColor != null ? { color: args.textColor } : {}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const External: Story = {args: { icon: 'external' }};
export const Download: Story = {args: { icon: 'download' }};
export const Lock: Story =     {args: { icon: 'lock'     }};