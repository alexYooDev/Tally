import React from 'react';

type AlertVariant = 'error' | 'success' | 'info' | 'warning';

interface AlertProps {
    variant?: AlertVariant;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
};

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
    return (
        <div className={`p-4 border rounded-lg ${variantStyles[variant]} ${className}`}>
            <div className="text-sm">{children}</div>
        </div>
    );
}

export function ErrorAlert({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <Alert variant="error" className={className}>{children}</Alert>;
}

export function SuccessAlert({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <Alert variant="success" className={className}>{children}</Alert>;
}

export function InfoAlert({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <Alert variant="info" className={className}>{children}</Alert>;
}

export function WarningAlert({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <Alert variant="warning" className={className}>{children}</Alert>;
}
