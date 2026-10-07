import React from 'react';
import '../css/tw-global.css';

type TileProps = {
    title: string;
    href: string;
    // 'headline' is a text-only card; 'overlay' and 'overlap' place the title over `image`.
    variant?: 'headline' | 'overlay' | 'overlap';
    // Image URL for the 'overlay' and 'overlap' variants. It is decorative: the title names the link.
    image?: string;
};

const focusStyle = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-anu-primary-800';

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
            <a
                href={href}
                className={`group relative flex min-h-40 w-full items-center overflow-hidden rounded-lg bg-anu-grey-100 py-5 pr-14 pl-5 transition-colors duration-200 hover:bg-anu-grey-200 motion-reduce:transition-none ${focusStyle}`}
            >
                <span aria-hidden="true" className="absolute -top-9 -right-10 size-21 rounded-full bg-anu-primary-700" />
                <span className="text-2xl/tight font-bold text-black group-hover:underline group-hover:underline-offset-4">
                    {title}
                    {get_arrow()}
                </span>
            </a>
        );
    }

    if (variant === 'overlay') {
        return (
            <a href={href} className={`group relative flex aspect-video w-full items-end justify-center overflow-hidden rounded-280 bg-black ${focusStyle}`}>
                {get_image(image)}
                <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/30 from-70% to-black/80" />
                <span className="relative px-2.5 pb-4 text-center text-xl font-medium text-white uppercase group-hover:underline group-hover:underline-offset-4">
                    {title}
                </span>
            </a>
        );
    }

    return (
        <a href={href} className={`group relative block aspect-video w-full overflow-hidden rounded-280 bg-black ${focusStyle}`}>
            {get_image(image)}
            <span className="absolute bottom-8 left-0 bg-black/70 p-4 text-2xl font-semibold text-white group-hover:underline group-hover:underline-offset-4">
                {title}
                {get_arrow()}
            </span>
        </a>
    );
};
