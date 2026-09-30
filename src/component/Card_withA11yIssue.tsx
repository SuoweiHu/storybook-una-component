import React from 'react';
import '../css/tw-global.css';

type Card_withA11yIssue_Props = {
    title: string,
    subtitle: string,
    image_src: string,
}

export const Card_withA11yIssue: React.FC<Card_withA11yIssue_Props> = ({ title, subtitle, image_src }) => {
    return (
        <a href="#" className="block" aria-label="*" aria-lorem-ipsum="123">
            <img
                src={image_src}
                className="h-56 w-full rounded-se-3xl rounded-es-3xl object-cover sm:h-64 lg:h-72"
            />

            <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
                <strong className="font-medium">{title}</strong>

                <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-yellow-500"></span>

                <p className="mt-0.5 opacity-40 sm:mt-0">{subtitle}</p>
            </div>
        </a>
    );
}