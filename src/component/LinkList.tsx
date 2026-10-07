import React from 'react';
import '../css/tw-global.css';

type LinkListItem = {
    label: string;
    href: string;
};

type LinkListProps = {
    links: LinkListItem[];
    heading?: string;
    // Decorative illustration shown above the heading.
    icon?: string;
    // Splits the links into side-by-side columns on wider screens.
    columns?: 1 | 2 | 3;
    // The background the list sits on.
    background?: 'white' | 'tint' | 'grey' | 'black';
};

const linkListStyles = {
    white: {
        heading: 'text-black',
        link: 'text-blue-700 hover:bg-anu-primary-100 focus-visible:bg-anu-primary-100',
    },
    tint: {
        heading: 'text-black',
        link: 'text-blue-700 hover:bg-white focus-visible:bg-white',
    },
    grey: {
        heading: 'text-black',
        link: 'text-anu-primary-1000 hover:bg-white focus-visible:bg-white',
    },
    black: {
        heading: 'text-white',
        link: 'text-anu-primary-700 hover:bg-anu-grey-700 hover:text-anu-primary-650 focus-visible:bg-anu-grey-700 focus-visible:text-anu-primary-650',
    },
} as const;

const columnStyles = {
    1: '',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
} as const;

const get_arrowIcon = () => (
    <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="11"
        viewBox="0 0 20.67 11.09"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
    >
        <path d="M12.73 0.75L19.92 5.55L12.73 10.34" />
        <path d="M0.75 5.55H19.92" />
    </svg>
);

// Splits links into `count` columns, filling each column top to bottom.
const get_columns = (links: LinkListItem[], count: number) => {
    const perColumn = Math.ceil(links.length / count);
    return Array.from({ length: count }, (_, index) => links.slice(index * perColumn, (index + 1) * perColumn)).filter(
        (column) => column.length > 0
    );
};

export const LinkList: React.FC<LinkListProps> = ({ links, heading, icon, columns = 1, background = 'white' }) => {
    const styles = linkListStyles[background];

    return (
        <section className="flex w-full flex-col">
            {icon && <img src={icon} alt="" className="size-20" />}
            {heading && <h2 className={`mb-4 text-xl/6 font-semibold ${styles.heading}`}>{heading}</h2>}

            <div className={`grid gap-x-6 gap-y-0 ${columnStyles[columns]}`}>
                {get_columns(links, columns).map((column, columnIndex) => (
                    <ul key={columnIndex} className={`border-anu-grey-200 md:border-t ${columnIndex === 0 ? 'border-t' : ''}`}>
                        {column.map((link) => (
                            <li key={`${link.href}-${link.label}`}>
                                <a
                                    href={link.href}
                                    className={`group flex items-center gap-2.5 border-b border-anu-grey-200 p-2.5 text-base/4.5 font-normal hover:font-medium hover:underline hover:underline-offset-4 focus-visible:font-medium focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current ${styles.link}`}
                                >
                                    <span className="flex-1">{link.label}</span>
                                    {get_arrowIcon()}
                                </a>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </section>
    );
};
