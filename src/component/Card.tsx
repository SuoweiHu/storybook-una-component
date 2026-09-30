import React from 'react';
import '../css/tw-global.css';

type CardProps = {
    title: string,
    subtitle: string,
    image_src: string,
}

export const Card: React.FC<CardProps> = ({ title, subtitle, image_src }) => {
    return (
        <a href="#" className="block">
            <img
                alt={title}
                src={image_src}
                className="h-56 w-full rounded-se-3xl rounded-es-3xl object-cover sm:h-64 lg:h-72"
            />

            <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
                <strong className="font-medium">{title}</strong>

                <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-yellow-500"></span>

                <p className="mt-0.5 opacity-70 sm:mt-0">{subtitle}</p>
            </div>
        </a>
    );
}