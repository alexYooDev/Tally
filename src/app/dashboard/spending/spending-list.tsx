// ================================================
// Spending List with Filters - Client Component
// ================================================
'use client';

import { useState, useMemo } from 'react';
import { SpendingActionsMenu } from './actions-menu';
import { formatCurrency, formatTransactionDate } from '@/lib/utils';
import type { SpendingTransactionWithCategory } from './actions';
import {
    SummaryCard,
    Badge,
    getPaymentMethodBadgeVariant,
    TransactionFilters,
    FilterState,
    Pagination,
    usePagination,
    TransactionTable,
    type TableColumn,
    ResultsCount,
    NoResults,
    SummaryCardGrid,
} from '@/components';

interface SpendingListProps {
    transactions: SpendingTransactionWithCategory[];
    categories: Array<{ id: string; name: string }>;
}

export function SpendingList({ transactions, categories }: SpendingListProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        paymentMethod: '',
        category: '',
        dateFrom: '',
        dateTo: '',
    });

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            // Search filter (description, notes)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    transaction.description?.toLowerCase().includes(searchLower) ||
                    transaction.notes?.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Payment method filter
            if (filters.paymentMethod && transaction.payment_method !== filters.paymentMethod) {
                return false;
            }

            // Category filter
            if (filters.category && transaction.category?.name !== filters.category) {
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
    const totalSpending = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = filteredTransactions.length;

    // Pagination
    const { currentPage, totalPages, setCurrentPage, paginateItems, itemsPerPage } = usePagination(
        filteredTransactions.length,
        15 // Show 15 transactions per page
    );
    const paginatedTransactions = paginateItems(filteredTransactions);

    // Table columns configuration
    const columns: TableColumn<SpendingTransactionWithCategory>[] = [
        {
            header: 'Date',
            render: (transaction) => (
                <div className='text-sm text-gray-900 dark:text-gray-100'>
                    {formatTransactionDate(transaction.date)}
                </div>
            ),
        },
        {
            header: 'Description',
            render: (transaction) => (
                <>
                    <div className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                        {transaction.description}
                    </div>
                    {transaction.notes && (
                        <div className='text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1'>
                            {transaction.notes}
                        </div>
                    )}
                </>
            ),
        },
        {
            header: 'Category',
            render: (transaction) => (
                transaction.category ? (
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {transaction.category.name}
                    </span>
                ) : (
                    <span className='text-sm text-gray-400 dark:text-gray-500 italic'>
                        No category
                    </span>
                )
            ),
        },
        {
            header: 'Payment',
            render: (transaction) => (
                <Badge variant={getPaymentMethodBadgeVariant(transaction.payment_method)}>
                    {transaction.payment_method.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            header: 'Amount',
            align: 'left',
            render: (transaction) => (
                <div className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                    {formatCurrency(transaction.amount)}
                </div>
            ),
        },
        {
            header: 'Actions',
            align: 'right',
            render: (transaction) => (
                <div className='flex justify-end items-start'>
                    <SpendingActionsMenu
                        transactionId={transaction.id}
                        transactionLabel={transaction.description}
                    />
                </div>
            ),
        },
    ];

    // Mobile card renderer
    const renderMobileCard = (transaction: SpendingTransactionWithCategory) => (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative'>
            {/* Actions - Top Right */}
            <div className='absolute top-2 right-2'>
                <SpendingActionsMenu
                    transactionId={transaction.id}
                    transactionLabel={transaction.description}
                />
            </div>

            {/* Header: Date and Amount */}
            <div className='flex items-start justify-between mb-3 pr-8'>
                <div className='flex-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                        {formatTransactionDate(transaction.date)}
                    </div>
                    <div className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                        {transaction.description}
                    </div>
                    {transaction.category && (
                        <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            {transaction.category.name}
                        </div>
                    )}
                </div>
                <div className='text-right ml-4'>
                    <div className='text-lg font-bold text-red-600 dark:text-red-400'>
                        {formatCurrency(transaction.amount)}
                    </div>
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
    );

    return (
        <>
            {/* Summary Cards */}
            <SummaryCardGrid>
                <SummaryCard
                    title='Total Spending'
                    shortTitle='Total Spent'
                    value={formatCurrency(totalSpending)}
                    valueColor='text-red-600 dark:text-red-400'
                />
                <SummaryCard
                    title='Transactions'
                    shortTitle='Transaction'
                    value={transactionCount}
                />
                <SummaryCard
                    title='Average Transaction'
                    shortTitle='Avg Spent'
                    value={formatCurrency(transactionCount > 0 ? totalSpending / transactionCount : 0)}
                />
            </SummaryCardGrid>

            {/* Filters */}
            <div className='mb-6'>
                <TransactionFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    categories={categories}
                    searchPlaceholder='Search by description or notes...'
                />
            </div>

            {/* Results Count */}
            <ResultsCount
                filtered={filteredTransactions.length}
                total={transactions.length}
                itemType="transactions"
            />

            {/* No Results */}
            {filteredTransactions.length === 0 && (
                <NoResults message="No transactions match your filters" />
            )}

            {/* Transaction Table */}
            {filteredTransactions.length > 0 && (
                <>
                    <TransactionTable
                        columns={columns}
                        data={paginatedTransactions}
                        getRowKey={(transaction) => transaction.id}
                        mobileCardRenderer={renderMobileCard}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredTransactions.length}
                    />
                </>
            )}
        </>
    );
}
