import React, { useId, useState } from 'react';
import { cva } from 'class-variance-authority';
import '../css/tw-global.css';

type AccordionItem = {
    title: string;
    content: React.ReactNode;
};

type AccordionProps = {
    items: AccordionItem[];
    // 'light' sits on white or cream backgrounds, 'dark' on black, 'grey' on grey.
    theme?: 'light' | 'dark' | 'grey';
    // Indexes of the items that start expanded.
    defaultOpen?: number[];
    // When false, opening an item closes the others.
    allowMultiple?: boolean;
};

const accordionTrigger = cva(
    'flex min-h-25 w-full cursor-pointer items-center justify-between gap-6 border-2 px-7 py-7 text-left text-3xl/10 font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4',
    {
        variants: {
            theme: {
                light: 'border-black focus-visible:outline-black',
                dark: 'border-white focus-visible:outline-white',
                grey: 'border-black focus-visible:outline-black',
            },
            isOpen: {
                true: '',
                false: '',
            },
        },
        compoundVariants: [
            { theme: 'light', isOpen: false, className: 'bg-white text-black' },
            { theme: 'light', isOpen: true, className: 'bg-black text-white' },
            { theme: 'dark', isOpen: false, className: 'bg-black text-white' },
            { theme: 'dark', isOpen: true, className: 'bg-white text-black' },
            { theme: 'grey', isOpen: false, className: 'bg-anu-grey-100 text-black' },
            { theme: 'grey', isOpen: true, className: 'bg-black text-white' },
        ],
    }
);

const accordionIcon = cva('shrink-0', {
    variants: {
        theme: {
            light: 'text-anu-primary-800',
            dark: 'text-anu-primary-800',
            grey: 'text-anu-primary-900',
        },
    },
});

// The vertical stroke of the plus collapses to turn it into a minus.
const accordionIconStroke = cva(
    'origin-center transition-transform duration-300 ease-in-out transform-fill motion-reduce:transition-none',
    {
        variants: {
            isOpen: {
                true: 'scale-y-0',
                false: 'scale-y-100',
            },
        },
    }
);

const accordionPanel = cva('overflow-hidden transition-all duration-500 ease-in-out motion-reduce:transition-none', {
    variants: {
        isOpen: {
            true: 'visible max-h-screen opacity-100',
            false: 'invisible max-h-0 opacity-0',
        },
    },
});

const accordionContent = cva('px-7.5 pt-8 pb-2 text-base/6.5 font-normal', {
    variants: {
        theme: {
            light: 'text-black',
            dark: 'text-white',
            grey: 'text-black',
        },
    },
});

type AccordionTheme = NonNullable<AccordionProps['theme']>;

const get_accordionIcon = (isOpen: boolean, theme: AccordionTheme) => (
    <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className={accordionIcon({ theme })}
    >
        <line x1="11.58" y1="0" x2="11.58" y2="21" className={accordionIconStroke({ isOpen })} />
        <line x1="21" y1="10.74" x2="0" y2="10.74" />
    </svg>
);

export const Accordion: React.FC<AccordionProps> = ({
    items,
    theme = 'light',
    defaultOpen = [],
    allowMultiple = false,
}) => {
    const id = useId();
    const [openItems, setOpenItems] = useState<number[]>(
        allowMultiple ? defaultOpen : defaultOpen.slice(0, 1)
    );

    const toggleItem = (index: number) => {
        setOpenItems((current) => {
            if (current.includes(index)) {
                return current.filter((i) => i !== index);
            }
            return allowMultiple ? [...current, index] : [index];
        });
    };

    return (
        <div className="flex w-full flex-col gap-6">
            {items.map((item, index) => {
                const isOpen = openItems.includes(index);
                const buttonId = `${id}-button-${index}`;
                const panelId = `${id}-panel-${index}`;

                return (
                    <div key={buttonId}>
                        <h3>
                            <button
                                type="button"
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => toggleItem(index)}
                                className={accordionTrigger({ theme, isOpen })}
                            >
                                <span>{item.title}</span>
                                {get_accordionIcon(isOpen, theme)}
                            </button>
                        </h3>

                        <div
                            role="region"
                            id={panelId}
                            aria-labelledby={buttonId}
                            className={accordionPanel({ isOpen })}
                        >
                            <div className={accordionContent({ theme })}>
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
