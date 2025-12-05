// ================================================
// Transaction Filters Component - Reusable
// ================================================
'use client';

import { useState } from 'react';

export interface FilterState {
    search: string;
    paymentMethod: string;
    category: string;
    dateFrom: string;
    dateTo: string;
}

interface TransactionFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    categories?: Array<{ id: string; name: string }>;
    showCategoryFilter?: boolean;
    searchPlaceholder?: string;
}

export function TransactionFilters({
    filters,
    onFilterChange,
    categories = [],
    showCategoryFilter = true,
    searchPlaceholder = 'Search transactions...',
}: TransactionFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (key: keyof FilterState, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    const handleClear = () => {
        onFilterChange({
            search: '',
            paymentMethod: '',
            category: '',
            dateFrom: '',
            dateTo: '',
        });
    };

    const hasActiveFilters = Object.values(filters).some((value) => value !== '');

    return (
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4'>
            {/* Search Bar - Always Visible */}
            <div className='flex gap-3 items-center'>
                <div className='flex-1 relative'>
                    <svg
                        className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        />
                    </svg>
                    <input
                        type='text'
                        placeholder={searchPlaceholder}
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                    />
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2'
                >
                    <svg
                        className='h-5 w-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                        />
                    </svg>
                    Filters
                    {hasActiveFilters && (
                        <span className='bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                            {Object.values(filters).filter((v) => v !== '').length}
                        </span>
                    )}
                </button>
            </div>

            {/* Advanced Filters - Collapsible */}
            {isExpanded && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    {/* Payment Method Filter */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Payment Method
                        </label>
                        <select
                            value={filters.paymentMethod}
                            onChange={(e) => handleChange('paymentMethod', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        >
                            <option value=''>All Methods</option>
                            <option value='cash'>Cash</option>
                            <option value='card'>Card</option>
                            <option value='bank_transfer'>Bank Transfer</option>
                            <option value='paypal'>PayPal</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    {showCategoryFilter && (
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            >
                                <option value=''>All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Date From */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            From Date
                        </label>
                        <input
                            type='date'
                            value={filters.dateFrom}
                            onChange={(e) => handleChange('dateFrom', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            To Date
                        </label>
                        <input
                            type='date'
                            value={filters.dateTo}
                            onChange={(e) => handleChange('dateTo', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        />
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <div className='md:col-span-2 lg:col-span-4 flex justify-end'>
                            <button
                                onClick={handleClear}
                                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition'
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
