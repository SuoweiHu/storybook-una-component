import React from 'react';
import '../css/tw-global.css';

import { getIconUrl, type IconName, type IconVariant } from './icons';

export type { HeroIconName, IconName, IconVariant, SocialIconName, UtilityIconName } from './icons';

type IconProps = {
    name: IconName;
    // Colour of the icon artwork. Use 'white' on dark backgrounds.
    variant?: IconVariant;
    // Rendered width and height in pixels. The artwork keeps its aspect ratio inside this box.
    size?: number;
    // Accessible name. Leave empty when the icon is decorative or sits next to visible text.
    label?: string;
    className?: string;
};

export const Icon: React.FC<IconProps> = ({ name, variant = 'black', size = 24, label, className = '' }) => {
    const src = getIconUrl(name, variant);
    if (!src) return null;

    return (
        <img
            src={src}
            alt={label ?? ''}
            aria-hidden={label ? undefined : true}
            width={size}
            height={size}
            className={`inline-block shrink-0 object-contain ${className}`}
            style={{ width: size, height: size }}
        />
    );
};
