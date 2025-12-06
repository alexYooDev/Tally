import React from 'react';
import Link from 'next/link';
import { GradientButton } from '@/components';

interface PageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export function PageHeader({ title, description, actionLabel, actionHref }: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <GradientButton size="default">
                        {actionLabel}
                    </GradientButton>
                </Link>
            )}
        </div>
    );
}
