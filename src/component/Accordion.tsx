import React, { useId, useState } from 'react';
import { tv } from 'tailwind-variants';
import '../css/tw-global.css';

type AccordionItem = {
    title: string;
    content: React.ReactNode;
};

const accordion = tv({
    slots: {
        root: 'flex w-full flex-col gap-6',
        button: 'flex min-h-25 w-full cursor-pointer items-center justify-between gap-6 border-2 px-7 py-7 text-left text-3xl/10 font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4',
        icon: 'shrink-0',
        iconLine: 'origin-center transition-transform duration-300 ease-in-out transform-fill motion-reduce:transition-none',
        panel: 'overflow-hidden transition-all duration-500 ease-in-out motion-reduce:transition-none',
        content: 'px-7.5 pt-8 pb-2 text-base/6.5 font-normal',
    },
    variants: {
        // 'light' sits on white or cream backgrounds, 'dark' on black, 'grey' on grey.
        theme: {
            light: {
                button: 'focus-visible:outline-black',
                content: 'text-black',
                icon: 'text-anu-primary-800',
            },
            dark: {
                button: 'focus-visible:outline-white',
                content: 'text-white',
                icon: 'text-anu-primary-800',
            },
            grey: {
                button: 'focus-visible:outline-black',
                content: 'text-black',
                icon: 'text-anu-primary-900',
            },
        },
        isOpen: {
            true: {
                iconLine: 'scale-y-0',
                panel: 'visible max-h-screen opacity-100',
            },
            false: {
                iconLine: 'scale-y-100',
                panel: 'invisible max-h-0 opacity-0',
            },
        },
    },
    compoundVariants: [
        { theme: 'light', isOpen: false, class: { button: 'border-black bg-white text-black' } },
        { theme: 'light', isOpen: true, class: { button: 'border-black bg-black text-white' } },
        { theme: 'dark', isOpen: false, class: { button: 'border-white bg-black text-white' } },
        { theme: 'dark', isOpen: true, class: { button: 'border-white bg-white text-black' } },
        { theme: 'grey', isOpen: false, class: { button: 'border-black bg-anu-grey-100 text-black' } },
        { theme: 'grey', isOpen: true, class: { button: 'border-black bg-black text-white' } },
    ],
    defaultVariants: {
        theme: 'light',
        isOpen: false,
    },
});

type AccordionProps = {
    items: AccordionItem[];
    // 'light' sits on white or cream backgrounds, 'dark' on black, 'grey' on grey.
    theme?: 'light' | 'dark' | 'grey';
    // Indexes of the items that start expanded.
    defaultOpen?: number[];
    // When false, opening an item closes the others.
    allowMultiple?: boolean;
};

const get_accordionIcon = (styles: ReturnType<typeof accordion>) => (
    <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className={styles.icon()}
    >
        <line x1="11.58" y1="0" x2="11.58" y2="21" className={styles.iconLine()} />
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
        <div className={accordion().root()}>
            {items.map((item, index) => {
                const isOpen = openItems.includes(index);
                const styles = accordion({ theme, isOpen });
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
                                className={styles.button()}
                            >
                                <span>{item.title}</span>
                                {get_accordionIcon(styles)}
                            </button>
                        </h3>

                        <div role="region" id={panelId} aria-labelledby={buttonId} className={styles.panel()}>
                            <div className={styles.content()}>{item.content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
