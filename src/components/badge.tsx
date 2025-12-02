import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    primary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
    return (
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
}

// Payment method specific badge helper
export function getPaymentMethodBadgeVariant(method: string): BadgeVariant {
    const methodMap: Record<string, BadgeVariant> = {
        cash: 'success',
        card: 'info',
        bank_transfer: 'primary',
        paypal: 'primary',
        other: 'default',
    };
    return methodMap[method] || 'default';
}
