import React from 'react';
import '../css/tw-global.css';

type Card_withChanges_Props = {
    title: string,
    href: string,
    variant: "light-primary"|"light-secondary"|"dark-primary"|"dark-secondary"
}


const get_colourClasses = (_variant_:string) => {
    if (_variant_ === "light-primary") {
        return "bg-white text-black border-gray-300 hover:border-gray-400";
    } else if (_variant_ === "light-secondary") {
        return "bg-[#F6EDDE] text-gray-800 border-[#F6EDDE] hover:border-gray-800";
    } else if (_variant_ === "dark-primary") {
        return "bg-black text-[#BE830E] border-black hover:border-[#BE830E]";
    } else if (_variant_ === "dark-secondary") {
        return "bg-black text-white border-black hover:border-white";
    }
}

export const Card_withChanges: React.FC<Card_withChanges_Props> = ({ title, href, variant }) => {

    return (
        <a
            href={href}
            aria-label={title}
            className={`
                flex px-12 py-6 gap-6 border-3 rounded-xl
                transition-all duration-300
                text-2xl font-semibold font-mono
                hover:shadow-lg hover:-translate-y-0.5 hover:translate-x-0.5
                group relative
                ${get_colourClasses(variant)}
            `}
        >

            <span>{title}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            <div className="size-3 bg-black rounded-full absolute -right-1 -top-1 animate-pulse"></div>
        </a>
    );
}