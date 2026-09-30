import React from 'react';
import '../css/tw-global.css';

type ToastProps = {
    title: string;
    description: string;
    type: 'success' | 'error' | 'warning';
};


const toastStyles = {
    success: {
        container: 'border-green-500 bg-green-50',
        title: 'text-green-800',
        description: 'text-green-700',
    },
    error: {
        container: 'border-red-500 bg-red-50',
        title: 'text-red-800',
        description: 'text-red-700',
    },
    warning: {
        container: 'border-amber-500 bg-amber-50',
        title: 'text-amber-800',
        description: 'text-amber-700',
    },
} as const;

const get_toastLogo = (type: 'success' | 'error' | 'warning') => {
    switch (type) {
        case 'success':
            return (
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="-mt-0.5 size-6 text-green-700"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            );
        case 'error':
            return (
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="-mt-0.5 size-6 text-red-700"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                </svg>
            );
        case 'warning':
            return (
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="-mt-0.5 size-6 text-amber-700"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                </svg>
            );
    }
}

export const Toast: React.FC<ToastProps> = ({ title, description, type }) => {
    const styles = toastStyles[type];
    return (
        <div role="alert" className={`rounded-md border ${styles.container} p-4 shadow-sm`}>
            <div className="flex items-start gap-4">
                {get_toastLogo(type)}

                <div className="flex-1">
                <strong className={`block leading-tight font-medium ${styles.title}`}> {title} </strong>

                <p className={`mt-0.5 text-sm ${styles.description}`}>
                    {description}
                </p>
                </div>
            </div>
        </div>
    );
}


