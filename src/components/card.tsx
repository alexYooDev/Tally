import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
            {children}
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: string;
    description?: string;
    valueColor?: string;
    responsive?: boolean;
}

export function StatCard({
    label,
    value,
    icon,
    description,
    valueColor = 'text-gray-900 dark:text-gray-100',
    responsive = false,
}: StatCardProps) {
    return (
        <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <p className={`${responsive ? 'text-xs md:text-sm' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400`}>
                    {label}
                </p>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>
            <p className={`${responsive ? 'text-lg md:text-3xl' : 'text-3xl'} font-bold ${valueColor}`}>
                {value}
            </p>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {description}
                </p>
            )}
        </Card>
    );
}

interface SummaryCardProps {
    title: string;
    value: string | number;
    shortTitle?: string;
    valueColor?: string;
}

export function SummaryCard({
    title,
    value,
    shortTitle,
    valueColor = 'text-gray-900 dark:text-gray-100',
}: SummaryCardProps) {
    return (
        <Card className="p-3 md:p-6">
            <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {shortTitle && (
                    <>
                        <span className="md:hidden">{shortTitle}</span>
                        <span className="hidden md:inline">{title}</span>
                    </>
                )}
                {!shortTitle && title}
            </p>
            <p className={`text-lg md:text-3xl font-bold ${valueColor}`}>
                {value}
            </p>
        </Card>
    );
}
