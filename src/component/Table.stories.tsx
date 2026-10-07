import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Table } from './Table';

const backgroundClasses = {
  white: 'bg-white',
  tint: 'bg-anu-primary-200',
  grey: 'bg-anu-grey-100',
  black: 'bg-black',
} as const;

const programColumns = ['Aligned Bachelor Program*', 'ANU GPA required to progress', 'Corresponding ANU selection rank'];

const programRows = [
  { cells: ['Bachelor of Accounting', '4.0**', '80'] },
  { cells: ['Bachelor of Business Administration', '4.0', '80'] },
  { cells: ['Bachelor of Commerce', '4.0', '80'] },
  { cells: ['Bachelor of Economics', '4.0', '80'] },
  { cells: ['Bachelor of Finance', '4.0', '80'] },
];

const scholarshipRows = [
  { header: 'Scholarship types »', cells: ['Academic'] },
  { header: 'Student type', cells: ['International'] },
  { header: 'Study level', cells: ['Undergraduate/Bachelor, Honours, Postgraduate/Masters, and Graduate certificate'] },
  { header: 'Selection bases', cells: ['Academic merit'] },
];

const studyAbroadColumns = ['Exchange', 'Year in Asia', 'Independent Learning Abroad'];

const studyAbroadRows = [
  { header: 'Study level', cells: ['Undergraduates and some Postgraduates', 'Undergraduates', 'Undergraduates, Postgraduates'] },
  { header: 'Length', cells: ['1 semester', '1 year', '1 semester to 2 semesters (with approval)'] },
  { header: 'Credits gained', cells: ['Credit-bearing usually 24 units', 'Credit-bearing, usually 48 units', 'Depends on approval'] },
  { header: 'Tuition fees', cells: ['Pay tuition fees to ANU and study at partner universities', 'Pay tuition fees to ANU and participate in Year in Asia program offered by CAP', 'Pay to third party and apply directly to the university'] },
  { header: 'Provider', cells: ['ANU Global Programs', 'College of Asia and Pacific (CAP)', 'External provider (you will have to source this yourself)'] },
];

const contactRows = [
  ['Anne Martin', 'Director', 'anne.martin@anu.edu.au', '+61 2 6125 1642'],
  ['Andrew Coulter', 'Scholarship Manager', 'andrew.coulter@anu.edu.au', '+61 2 6125 2363'],
  ['Cathleen Nansen', 'Administration Manager', 'cathleen.nansen@anu.edu.au', '+61 2 6125 3441'],
  ['Georgia North', 'Academic and Student Support Manager', 'georgia.north@anu.edu.au', '+61 2 6125 4038'],
  ['Dean O’Neil', 'Senior Community Engagement Officer', 'dean.oneil@anu.edu.au', '+61 461 548 402'],
].map(([name, role, email, phone]) => ({
  cells: [
    { text: name, subtext: role },
    {
      links: [
        { label: email, href: `mailto:${email}` },
        { label: phone, href: `tel:${phone.replaceAll(' ', '')}` },
      ],
    },
  ],
}));

const meta = {
  title: 'Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    columns: programColumns,
    rows: programRows,
    caption: 'Aligned bachelor programs and their progression requirements',
    background: 'white',
    variant: 'default',
    bordered: false,
  },
  argTypes: {
    columns: { control: 'object', description: 'Header row labels. Leave empty for row headers only.' },
    rows: { control: 'object', description: 'Each row has optional `header` and a list of `cells`.' },
  },
  decorators: [
    (Story, { args }) => (
      <div className={`p-12 ${backgroundClasses[args.background ?? 'white']}`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(3);
    await expect(canvas.getAllByRole('row')).toHaveLength(6);
  },
};

export const Striped: Story = {
  args: { variant: 'striped' },
};

export const OnBlack: Story = {
  args: { background: 'black' },
};

export const StripedOnBlack: Story = {
  args: { background: 'black', variant: 'striped' },
};

export const OnTint: Story = {
  args: { background: 'tint' },
};

export const OnGrey: Story = {
  args: { background: 'grey', variant: 'striped' },
};

export const RowHeaders: Story = {
  args: {
    columns: [],
    rows: scholarshipRows,
    caption: 'Scholarship details',
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('columnheader')).toHaveLength(0);
    await expect(canvas.getAllByRole('rowheader')).toHaveLength(4);
  },
};

export const RowAndColumnHeaders: Story = {
  args: {
    columns: studyAbroadColumns,
    rows: studyAbroadRows,
    caption: 'Comparison of study abroad options',
  },
};

export const StripedRowAndColumnHeaders: Story = {
  args: {
    columns: studyAbroadColumns,
    rows: studyAbroadRows,
    caption: 'Comparison of study abroad options',
    background: 'black',
    variant: 'striped',
  },
};

export const BorderedWithMergedCells: Story = {
  args: {
    columns: studyAbroadColumns,
    rows: [
      studyAbroadRows[0],
      { header: 'Merged cell', cells: [{ text: '1 semester or 1 year', colSpan: 2 }, '1 semester to 2 semesters (with approval)'] },
      ...studyAbroadRows.slice(2),
    ],
    caption: 'Comparison of study abroad options',
    background: 'tint',
    variant: 'striped',
    bordered: true,
  },
  play: async ({ canvas }) => {
    const merged = canvas.getByRole('cell', { name: '1 semester or 1 year' });
    await expect(merged).toHaveAttribute('colspan', '2');
  },
};

export const WithSubHeadings: Story = {
  args: {
    columns: ['Name', 'Contact details'],
    rows: contactRows,
    caption: 'Contacts',
  },
};
