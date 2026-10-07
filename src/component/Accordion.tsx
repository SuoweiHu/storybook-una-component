import React, { useId, useState } from 'react';
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

const accordionStyles = {
    light: {
        closed: 'border-black bg-white text-black',
        open: 'border-black bg-black text-white',
        content: 'text-black',
        icon: 'text-anu-primary-800',
        focus: 'focus-visible:outline-black',
    },
    dark: {
        closed: 'border-white bg-black text-white',
        open: 'border-white bg-white text-black',
        content: 'text-white',
        icon: 'text-anu-primary-800',
        focus: 'focus-visible:outline-white',
    },
    grey: {
        closed: 'border-black bg-anu-grey-100 text-black',
        open: 'border-black bg-black text-white',
        content: 'text-black',
        icon: 'text-anu-primary-900',
        focus: 'focus-visible:outline-black',
    },
} as const;

const get_accordionIcon = (isOpen: boolean, className: string) => (
    <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className={`shrink-0 ${className}`}
    >
        <line
            x1="11.58"
            y1="0"
            x2="11.58"
            y2="21"
            className={`origin-center transition-transform duration-300 ease-in-out transform-fill motion-reduce:transition-none ${isOpen ? 'scale-y-0' : 'scale-y-100'}`}
        />
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
    const styles = accordionStyles[theme];
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
                                className={`flex min-h-25 w-full cursor-pointer items-center justify-between gap-6 border-2 px-7 py-7 text-left text-3xl/10 font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 ${styles.focus} ${isOpen ? styles.open : styles.closed}`}
                            >
                                <span>{item.title}</span>
                                {get_accordionIcon(isOpen, styles.icon)}
                            </button>
                        </h3>

                        <div
                            role="region"
                            id={panelId}
                            aria-labelledby={buttonId}
                            className={`overflow-hidden transition-all duration-500 ease-in-out motion-reduce:transition-none ${isOpen ? 'visible max-h-screen opacity-100' : 'invisible max-h-0 opacity-0'}`}
                        >
                            <div className={`px-7.5 pt-8 pb-2 text-base/6.5 font-normal ${styles.content}`}>
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
