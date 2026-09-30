import type { Meta, StoryObj } from '@storybook/react-vite';
import {Card_withA11yIssue} from './Card_withA11yIssue';


const meta = {
    title: "Example-3-A11y-Testing/[3.a] Card with A11y Issue",
    component: Card_withA11yIssue,
    autodocs: true,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        title: { control: 'text' },
        subtitle: { control: 'text' },
        image_src: { control: "object", table: {readonly: true}},
        image_upload: { control: 'file', accept: 'image/*' },
    },
    args: {
        title: "Company Name",
        subtitle: "Branding / Signage",
        image_src:"https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&q=80&w=1160",
        image_upload: null,
    }
} satisfies Meta<typeof Card_withA11yIssue>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "Company Name",
        subtitle: "Branding / Signage",
        image_src: "https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&q=80&w=1160",
    },
    render: (args) => {
        if(args.image_upload!=null){args.image_src = args.image_upload[0];}
        return(<Card_withA11yIssue {...args} />)
    },
};