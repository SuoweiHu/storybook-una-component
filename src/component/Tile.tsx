import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import '../css/tw-global.css';

type TileProps = {
    title: string;
    href: string;
    // 'headline' is a text-only card; 'overlay' and 'overlap' place the title over `image`.
    variant?: NonNullable<VariantProps<typeof tileRoot>['variant']>;
    // Image URL for the 'overlay' and 'overlap' variants. It is decorative: the title names the link.
    image?: string;
};

const focusStyle = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anu-primary-800';

const tileRoot = cva(`group relative w-full overflow-hidden ${focusStyle}`, {
    variants: {
        variant: {
            headline:
                'flex min-h-40 items-center rounded-lg bg-anu-grey-100 py-5 pr-14 pl-5 transition-colors duration-200 hover:bg-anu-grey-200 motion-reduce:transition-none',
            overlay: 'flex aspect-video items-end justify-center rounded-280 bg-black',
            overlap: 'block aspect-video rounded-280 bg-black',
        },
    },
    defaultVariants: {
        variant: 'headline',
    },
});

const tileTitle = cva('group-hover:underline group-hover:underline-offset-4', {
    variants: {
        variant: {
            headline: 'text-2xl/tight font-bold text-black',
            overlay: 'relative px-2.5 pb-4 text-center text-xl font-medium text-white uppercase',
            overlap: 'absolute bottom-8 left-0 bg-black/70 p-4 text-2xl font-semibold text-white',
        },
    },
    defaultVariants: {
        variant: 'headline',
    },
});

const get_arrow = () => <span aria-hidden="true"> »</span>;

const get_image = (image?: string) =>
    image && (
        <img
            src={image}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
        />
    );

export const Tile: React.FC<TileProps> = ({ title, href, variant = 'headline', image }) => {
    if (variant === 'headline') {
        return (
            <a href={href} className={tileRoot({ variant })}>
                <span aria-hidden="true" className="absolute -top-9 -right-10 size-21 rounded-full bg-anu-primary-700" />
                <span className={tileTitle({ variant })}>
                    {title}
                    {get_arrow()}
                </span>
            </a>
        );
    }

    if (variant === 'overlay') {
        return (
            <a href={href} className={tileRoot({ variant })}>
                {get_image(image)}
                <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/30 from-70% to-black/80" />
                <span className={tileTitle({ variant })}>
                    {title}
                </span>
            </a>
        );
    }

    return (
        <a href={href} className={tileRoot({ variant })}>
            {get_image(image)}
            <span className={tileTitle({ variant })}>
                {title}
                {get_arrow()}
            </span>
        </a>
    );
};
