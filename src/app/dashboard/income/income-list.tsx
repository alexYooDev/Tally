// ================================================
// Income List with Filters - Client Component
// ================================================
'use client';

import { useState, useMemo } from 'react';
import { IncomeActionsMenu } from './actions-menu';
import { formatCurrency } from '@/lib/utils';
import type { IncomeTransactionWithService } from '@/types/supabase';
import {
    SummaryCard,
    Badge,
    getPaymentMethodBadgeVariant,
    TransactionFilters,
    FilterState,
} from '@/components';

interface IncomeListProps {
    transactions: IncomeTransactionWithService[];
}

export function IncomeList({ transactions }: IncomeListProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        paymentMethod: '',
        category: '',
        dateFrom: '',
        dateTo: '',
    });

    // Extract unique categories from services
    const categories = useMemo(() => {
        const uniqueCategories = new Map();
        transactions.forEach((t) => {
            if (t.service?.category) {
                uniqueCategories.set(t.service.category.id, t.service.category);
            }
        });
        return Array.from(uniqueCategories.values());
    }, [transactions]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            // Search filter (client name, service name, notes)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    transaction.client_name?.toLowerCase().includes(searchLower) ||
                    transaction.service?.name?.toLowerCase().includes(searchLower) ||
                    transaction.notes?.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Payment method filter
            if (filters.paymentMethod && transaction.payment_method !== filters.paymentMethod) {
                return false;
            }

            // Category filter
            if (filters.category && transaction.service?.category?.name !== filters.category) {
                return false;
            }

            // Date range filter
            if (filters.dateFrom && transaction.date < filters.dateFrom) {
                return false;
            }
            if (filters.dateTo && transaction.date > filters.dateTo) {
                return false;
            }

            return true;
        });
    }, [transactions, filters]);

    // Calculate summary from filtered data
    const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.total_received, 0);
    const transactionCount = filteredTransactions.length;

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            {/* Summary Cards */}
            <div className='grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-6'>
                <SummaryCard
                    title='Total Income'
                    shortTitle='Total Inc.'
                    value={formatCurrency(totalIncome)}
                    valueColor='text-indigo-600 dark:text-indigo-400'
                />
                <SummaryCard
                    title='Transactions'
                    shortTitle='Transaction'
                    value={transactionCount}
                />
                <SummaryCard
                    title='Average Transaction'
                    shortTitle='Avg Inc.'
                    value={formatCurrency(transactionCount > 0 ? totalIncome / transactionCount : 0)}
                />
            </div>

            {/* Filters */}
            <div className='mb-6'>
                <TransactionFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    categories={categories}
                    searchPlaceholder='Search by client, service, or notes...'
                />
            </div>

            {/* Results Count */}
            {transactionCount > 0 && (
                <div className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                </div>
            )}

            {/* No Results */}
            {filteredTransactions.length === 0 && (
                <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <p className='text-gray-500 dark:text-gray-400'>
                        No transactions match your filters
                    </p>
                </div>
            )}

            {/* Desktop Table View */}
            {filteredTransactions.length > 0 && (
                <>
                    <div className='hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Date
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Service / Client
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Payment
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Amount
                                    </th>
                                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900 dark:text-gray-100'>
                                                {formatDate(transaction.date)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                                                {transaction.service?.name || 'No service'}
                                            </div>
                                            {transaction.client_name && (
                                                <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                    {transaction.client_name}
                                                </div>
                                            )}
                                            {transaction.notes && (
                                                <div className='text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1'>
                                                    {transaction.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <Badge variant={getPaymentMethodBadgeVariant(transaction.payment_method)}>
                                                {transaction.payment_method.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-left'>
                                            <div className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                                {formatCurrency(transaction.total_received)}
                                            </div>
                                            {transaction.discount > 0 && (
                                                <div className='text-xs text-gray-500 dark:text-gray-400'>
                                                    ({formatCurrency(transaction.price)} - {formatCurrency(transaction.discount)} discount)
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                            <div className='flex justify-end items-start'>
                                                <IncomeActionsMenu
                                                    transactionId={transaction.id}
                                                    transactionLabel={transaction.service?.name || formatDate(transaction.date)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className='md:hidden space-y-3'>
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative'
                            >
                                {/* Actions - Top Right */}
                                <div className='absolute top-2 right-2'>
                                    <IncomeActionsMenu
                                        transactionId={transaction.id}
                                        transactionLabel={transaction.service?.name || formatDate(transaction.date)}
                                    />
                                </div>

                                {/* Header: Date and Amount */}
                                <div className='flex items-start justify-between mb-3 pr-8'>
                                    <div className='flex-1'>
                                        <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                            {formatDate(transaction.date)}
                                        </div>
                                        <div className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                                            {transaction.service?.name || 'No service'}
                                        </div>
                                        {transaction.client_name && (
                                            <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                                {transaction.client_name}
                                            </div>
                                        )}
                                    </div>
                                    <div className='text-right ml-4'>
                                        <div className='text-lg font-bold text-indigo-600 dark:text-indigo-400'>
                                            {formatCurrency(transaction.total_received)}
                                        </div>
                                        {transaction.discount > 0 && (
                                            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                                -{formatCurrency(transaction.discount)} off
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method Badge */}
                                <div className='mb-3'>
                                    <Badge variant={getPaymentMethodBadgeVariant(transaction.payment_method)}>
                                        {transaction.payment_method.replace('_', ' ')}
                                    </Badge>
                                </div>

                                {/* Notes */}
                                {transaction.notes && (
                                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                                        {transaction.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
