import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { LinkList } from './LinkList';

const backgroundClasses = {
  white: 'bg-white',
  tint: 'bg-anu-primary-100-a50',
  grey: 'bg-anu-grey-100',
  black: 'bg-black',
} as const;

const itLinks = [
  { label: 'Academic software requests', href: '#academic-software-requests' },
  { label: 'End User Computing Services', href: '#end-user-computing-services' },
  { label: 'Enterprise systems', href: '#enterprise-systems' },
  { label: 'Information commons', href: '#information-commons' },
  { label: 'Software purchasing', href: '#software-purchasing' },
  { label: 'Web browser tips', href: '#web-browser-tips' },
  { label: 'Windows 11', href: '#windows-11' },
  { label: 'ANU Data Commons', href: '#anu-data-commons' },
  { label: 'Change ES Password', href: '#change-es-password' },
  { label: 'Help, support & notices', href: '#help-support-notices' },
  { label: 'QuickLink service', href: '#quicklink-service' },
];

const genderEquityLinks = [
  { label: 'Athena SWAN', href: '#athena-swan' },
  { label: 'Gender inclusive language', href: '#gender-inclusive-language' },
  { label: 'Statistics and reports WGEA gender pay gap employer statement', href: '#wgea-statement' },
  { label: 'ANU LGBTIQA + Ally Network', href: '#ally-network' },
  { label: 'Gender affirmation guide', href: '#gender-affirmation-guide' },
  { label: 'Pronouns fact sheet', href: '#pronouns-fact-sheet' },
];

const meta = {
  title: 'LinkList',
  component: LinkList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    links: itLinks,
    columns: 3,
    background: 'white',
  },
  argTypes: {
    links: { control: 'object', description: 'Each link has a `label` and `href`.' },
    icon: { control: 'text', description: 'Image URL for the illustration above the heading.' },
  },
  decorators: [
    (Story, { args }) => (
      <div className={`p-12 ${backgroundClasses[args.background ?? 'white']}`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('list')).toHaveLength(3);
    await expect(canvas.getAllByRole('link')).toHaveLength(11);
    await expect(canvas.getByRole('link', { name: 'Windows 11' })).toHaveAttribute('href', '#windows-11');
  },
};

export const OnTint: Story = {
  args: { background: 'tint' },
};

export const OnGrey: Story = {
  args: { background: 'grey' },
};

export const OnBlack: Story = {
  args: { background: 'black' },
};

export const WithHeading: Story = {
  args: {
    links: genderEquityLinks,
    columns: 1,
    heading: 'Gender Equity & Gender Diversity',
    icon: '/linklist-gender-equity.svg',
  },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('heading', { name: 'Gender Equity & Gender Diversity' })).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Athena SWAN' })).toHaveFocus();
  },
};

export const WithHeadingOnTint: Story = {
  args: { ...WithHeading.args, background: 'tint' },
  decorators: WithHeading.decorators,
};

export const WithHeadingOnGrey: Story = {
  args: { ...WithHeading.args, background: 'grey' },
  decorators: WithHeading.decorators,
};

export const WithHeadingOnBlack: Story = {
  args: { ...WithHeading.args, background: 'black', icon: '/linklist-gender-equity-white.svg' },
  decorators: WithHeading.decorators,
};
