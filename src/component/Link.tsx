import React, { type AnchorHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import '../css/tw-global.css';

export const linkVariants = cva(
    // default styles
    'rounded-xs text-base/4.5 font-normal underline focus-visible:no-underline focus-visible:outline-2 focus-visible:outline-offset-2',
    {
        // variant styles
        variants: {
            background: {
                light: 'text-blue-600 visited:text-anu-slate-600 hover:bg-blue-50 focus-visible:outline-blue-600 active:bg-blue-100 active:text-blue-700',
                dark: 'text-white visited:text-anu-slate-200 hover:bg-anu-neutral-600 focus-visible:outline-white active:bg-anu-neutral-500 active:text-white',
            },
        },
        // default variant
        defaultVariants: {
            background: 'light',
        },
    }
);

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {}

export const Link: React.FC<LinkProps> = ({ background, children, href }) => {
    return ( <a className={linkVariants({ background })} href={href}> {children}</a>);
};
