import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    examples?: string[];
}

export function EmptyState({
    icon = '📋',
    title,
    description,
    actionLabel,
    actionHref,
    examples = [],
}: EmptyStateProps) {
    return (
        <Card className="p-12 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="inline-block px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                >
                    {actionLabel}
                </Link>
            )}
            {examples.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Examples:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {examples.map((example, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                                {example}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
