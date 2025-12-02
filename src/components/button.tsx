import React from 'react';
import { LoadingSpinner } from './loading-spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

const variantStyles = {
    primary: 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800',
    secondary: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    danger: 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800',
};

const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg',
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <LoadingSpinner className="-ml-1 mr-3 text-white" />
                    {typeof children === 'string' ? 'Loading...' : children}
                </span>
            ) : (
                children
            )}
        </button>
    );
}

export function PrimaryButton(props: ButtonProps) {
    return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: ButtonProps) {
    return <Button variant="secondary" {...props} />;
}

export function DangerButton(props: ButtonProps) {
    return <Button variant="danger" {...props} />;
}
