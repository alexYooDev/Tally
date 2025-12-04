// ================================================
// Reusable Transaction Table Component
// ================================================
'use client';

import React from 'react';

export interface TableColumn<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

interface TransactionTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    getRowKey: (item: T) => string;
    mobileCardRenderer?: (item: T) => React.ReactNode;
}

export function TransactionTable<T>({
    columns,
    data,
    getRowKey,
    mobileCardRenderer,
}: TransactionTableProps<T>) {
    return (
        <>
            {/* Desktop Table View */}
            <div className='hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
                <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700'>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.className || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {data.map((item) => (
                            <tr key={getRowKey(item)} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${colIndex === 0 ? 'whitespace-nowrap' : ''}`}
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : column.accessor
                                            ? String(item[column.accessor])
                                            : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            {mobileCardRenderer && (
                <div className='md:hidden space-y-3'>
                    {data.map((item) => (
                        <React.Fragment key={getRowKey(item)}>
                            {mobileCardRenderer(item)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </>
    );
}
