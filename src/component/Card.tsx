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
                alt=""
                src={image_src}
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
            />

            <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>

            <p className="mt-2 max-w-sm text-gray-700">
                {subtitle}
            </p>
        </a>
    );
}


