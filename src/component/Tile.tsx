import React from 'react';
import { tv } from 'tailwind-variants';
import '../css/tw-global.css';

const tile = tv({
    slots: {
        root: 'group relative w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anu-primary-800',
        image: 'absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none',
        decoration: '',
        title: 'group-hover:underline group-hover:underline-offset-4',
    },
    variants: {
        // 'headline' is a text-only card; 'overlay' and 'overlap' place the title over `image`.
        variant: {
            headline: {
                root: 'flex min-h-40 items-center rounded-lg bg-anu-grey-100 py-5 pr-14 pl-5 transition-colors duration-200 hover:bg-anu-grey-200 motion-reduce:transition-none',
                decoration: 'absolute -top-9 -right-10 size-21 rounded-full bg-anu-primary-700',
                title: 'text-2xl/tight font-bold text-black',
            },
            overlay: {
                root: 'flex aspect-video items-end justify-center rounded-280 bg-black',
                decoration: 'absolute inset-0 bg-linear-to-b from-black/30 from-70% to-black/80',
                title: 'relative px-2.5 pb-4 text-center text-xl font-medium text-white uppercase',
            },
            overlap: {
                root: 'block aspect-video rounded-280 bg-black',
                title: 'absolute bottom-8 left-0 bg-black/70 p-4 text-2xl font-semibold text-white',
            },
        },
    },
    defaultVariants: {
        variant: 'headline',
    },
});

type TileProps = {
    title: string;
    href: string;
    // 'headline' is a text-only card; 'overlay' and 'overlap' place the title over `image`.
    variant?: 'headline' | 'overlay' | 'overlap';
    // Image URL for the 'overlay' and 'overlap' variants. It is decorative: the title names the link.
    image?: string;
};

export const Tile: React.FC<TileProps> = ({ title, href, variant = 'headline', image }) => {
    const styles = tile({ variant });
    const hasArrow = variant !== 'overlay';

    return (
        <a href={href} className={styles.root()}>
            {variant === 'headline' && <span aria-hidden="true" className={styles.decoration()} />}
            {variant !== 'headline' && image && <img src={image} alt="" className={styles.image()} />}
            {variant === 'overlay' && <span aria-hidden="true" className={styles.decoration()} />}
            <span className={styles.title()}>
                {title}
                {hasArrow && <span aria-hidden="true"> »</span>}
            </span>
        </a>
    );
};
