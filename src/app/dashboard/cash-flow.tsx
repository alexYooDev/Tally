// ================================================
// Cash Flow - Combined Income & Spending View
// ================================================
'use client';

import { useState, useMemo } from 'react';
import { formatCurrency, formatTransactionDate } from '@/lib/utils';
import type { CashFlowTransaction } from './actions';
import { Badge, getPaymentMethodBadgeVariant, SummaryCard, Pagination, usePagination, TransactionTable, type TableColumn, SummaryCardGrid, FilterTabs, type FilterTab } from '@/components';

interface CashFlowProps {
    transactions: CashFlowTransaction[];
}

type FilterType = 'all' | 'income' | 'spending';

export function CashFlow({ transactions }: CashFlowProps) {
    const [filter, setFilter] = useState<FilterType>('all');

    // Filter transactions based on type
    const filteredTransactions = useMemo(() => {
        if (filter === 'all') return transactions;
        return transactions.filter((t) => t.type === filter);
    }, [transactions, filter]);

    // Calculate running balance
    const transactionsWithBalance = useMemo(() => {
        let balance = 0;
        // Since transactions are sorted newest first, we need to reverse for balance calculation
        const reversed = [...filteredTransactions].reverse();
        const withBalance = reversed.map((t) => {
            if (t.type === 'income') {
                balance += t.amount;
            } else {
                balance -= t.amount;
            }
            return {
                ...t,
                balance,
            };
        });
        // Reverse back to newest first
        return withBalance.reverse();
    }, [filteredTransactions]);

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalSpending = transactions.filter((t) => t.type === 'spending').reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = totalIncome - totalSpending;

    // Pagination
    const { currentPage, totalPages, setCurrentPage, paginateItems, itemsPerPage } = usePagination(
        transactionsWithBalance.length,
        15 // Show 15 transactions per page
    );
    const paginatedTransactions = paginateItems(transactionsWithBalance);

    // Table columns configuration
    const columns: TableColumn<typeof transactionsWithBalance[0]>[] = [
        {
            header: 'Date',
            render: (transaction) => (
                <div className='text-sm text-gray-900 dark:text-gray-100'>
                    {formatTransactionDate(transaction.date)}
                </div>
            ),
        },
        {
            header: 'Type',
            render: (transaction) => (
                <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                    {transaction.type}
                </Badge>
            ),
        },
        {
            header: 'Description',
            render: (transaction) => (
                <>
                    <div className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                        {transaction.description}
                    </div>
                    {transaction.category && (
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                            {transaction.category}
                        </div>
                    )}
                    {transaction.notes && (
                        <div className='text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1'>
                            {transaction.notes}
                        </div>
                    )}
                </>
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
            align: 'right',
            render: (transaction) => (
                <div className={`text-sm font-semibold ${
                    transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                </div>
            ),
        },
        {
            header: 'Balance',
            align: 'right',
            render: (transaction) => (
                <div className={`text-sm font-semibold ${
                    transaction.balance >= 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-600 dark:text-red-400'
                }`}>
                    {formatCurrency(transaction.balance)}
                </div>
            ),
        },
    ];

    // Mobile card renderer
    const renderMobileCard = (transaction: typeof transactionsWithBalance[0]) => (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4'>
            {/* Header: Date and Amount */}
            <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                        {formatTransactionDate(transaction.date)}
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <div className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                            {transaction.description}
                        </div>
                        <Badge
                            variant={transaction.type === 'income' ? 'success' : 'destructive'}
                            className='shrink-0'
                        >
                            {transaction.type}
                        </Badge>
                    </div>
                    {transaction.category && (
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                            {transaction.category}
                        </div>
                    )}
                </div>
                <div className='text-right ml-4'>
                    <div className={`text-lg font-bold ${
                        transaction.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                    </div>
                    <div className={`text-xs mt-1 ${
                        transaction.balance >= 0
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}>
                        Bal: {formatCurrency(transaction.balance)}
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

    // Filter tabs configuration
    const filterTabs: FilterTab[] = [
        { label: 'All', value: 'all', count: transactions.length, color: 'indigo' },
        { label: 'Income', value: 'income', count: transactions.filter((t) => t.type === 'income').length, color: 'green' },
        { label: 'Spending', value: 'spending', count: transactions.filter((t) => t.type === 'spending').length, color: 'red' },
    ];

    return (
        <div className='space-y-6'>
            {/* Summary Cards - Using Reusable Component */}
            <SummaryCardGrid>
                <SummaryCard
                    title="Total Income"
                    shortTitle="Income"
                    value={formatCurrency(totalIncome)}
                    icon="💰"
                    description={`${transactions.filter((t) => t.type === 'income').length} transactions`}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                    titleColor="text-green-700 dark:text-green-400"
                    valueColor="text-green-600 dark:text-green-400"
                    descriptionColor="text-green-600/70 dark:text-green-400/70"
                />
                <SummaryCard
                    title="Total Spending"
                    shortTitle="Spending"
                    value={formatCurrency(totalSpending)}
                    icon="💸"
                    description={`${transactions.filter((t) => t.type === 'spending').length} transactions`}
                    gradient="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800"
                    titleColor="text-red-700 dark:text-red-400"
                    valueColor="text-red-600 dark:text-red-400"
                    descriptionColor="text-red-600/70 dark:text-red-400/70"
                />
                <SummaryCard
                    title="Net Cash Flow"
                    shortTitle="Net Flow"
                    value={`${netCashFlow >= 0 ? '+' : '-'}${formatCurrency(Math.abs(netCashFlow))}`}
                    icon={netCashFlow >= 0 ? '🤑' : '🫩'}
                    description={netCashFlow >= 0 ? 'Profit' : 'Loss'}
                    gradient={
                        netCashFlow >= 0
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                            : 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800'
                    }
                    titleColor={netCashFlow >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}
                    valueColor={netCashFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}
                    descriptionColor={
                        netCashFlow >= 0 ? 'text-blue-600/70 dark:text-blue-400/70' : 'text-orange-600/70 dark:text-orange-400/70'
                    }
                />
            </SummaryCardGrid>

            {/* Filter Tabs */}
            <FilterTabs
                tabs={filterTabs}
                activeTab={filter}
                onTabChange={setFilter}
            />

            {/* Transaction Table */}
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
                totalItems={transactionsWithBalance.length}
            />
        </div>
    );
}
