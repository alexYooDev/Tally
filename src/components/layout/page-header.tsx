import React from 'react';
import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export function PageHeader({ title, description, actionLabel, actionHref }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                {description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
