// ================================================
// Cash Flow - Combined Income & Spending View
// ================================================
'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import type { CashFlowTransaction } from './actions';
import { Badge, getPaymentMethodBadgeVariant } from '@/components';

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

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalSpending = transactions.filter((t) => t.type === 'spending').reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = totalIncome - totalSpending;

    return (
        <div className='space-y-6'>
            {/* Summary Cards - Integrated */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Total Income */}
                <div className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='text-sm font-medium text-green-700 dark:text-green-400'>Total Income</div>
                        <div className='text-2xl'>💰</div>
                    </div>
                    <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-1'>
                        {formatCurrency(totalIncome)}
                    </div>
                    <div className='text-xs text-green-600/70 dark:text-green-400/70'>
                        {transactions.filter((t) => t.type === 'income').length} transactions
                    </div>
                </div>

                {/* Total Spending */}
                <div className='bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='text-sm font-medium text-red-700 dark:text-red-400'>Total Spending</div>
                        <div className='text-2xl'>💸</div>
                    </div>
                    <div className='text-3xl font-bold text-red-600 dark:text-red-400 mb-1'>
                        {formatCurrency(totalSpending)}
                    </div>
                    <div className='text-xs text-red-600/70 dark:text-red-400/70'>
                        {transactions.filter((t) => t.type === 'spending').length} transactions
                    </div>
                </div>

                {/* Net Cash Flow */}
                <div className={`bg-gradient-to-br ${
                    netCashFlow >= 0
                        ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                        : 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800'
                } border rounded-xl p-6 shadow-sm`}>
                    <div className='flex items-center justify-between mb-2'>
                        <div className={`text-sm font-medium ${
                            netCashFlow >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'
                        }`}>
                            Net Cash Flow
                        </div>
                        <div className='text-2xl'>{netCashFlow >= 0 ? '🤑' : '🫩'}</div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${
                        netCashFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                    }`}>
                        {netCashFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netCashFlow))}
                    </div>
                    <div className={`text-xs ${
                        netCashFlow >= 0 ? 'text-blue-600/70 dark:text-blue-400/70' : 'text-orange-600/70 dark:text-orange-400/70'
                    }`}>
                        {netCashFlow >= 0 ? 'Profit' : 'Loss'}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className='flex gap-2 border-b border-gray-200 dark:border-gray-700'>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 font-medium text-sm transition ${
                        filter === 'all'
                            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                    All ({transactions.length})
                </button>
                <button
                    onClick={() => setFilter('income')}
                    className={`px-4 py-2 font-medium text-sm transition ${
                        filter === 'income'
                            ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                    Income ({transactions.filter((t) => t.type === 'income').length})
                </button>
                <button
                    onClick={() => setFilter('spending')}
                    className={`px-4 py-2 font-medium text-sm transition ${
                        filter === 'spending'
                            ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                    Spending ({transactions.filter((t) => t.type === 'spending').length})
                </button>
            </div>

            {/* Desktop Table */}
            <div className='hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
                <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Date
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Type
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Description
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Payment
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Amount
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                                Balance
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {transactionsWithBalance.map((transaction) => (
                            <tr key={transaction.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-900 dark:text-gray-100'>
                                        {formatDate(transaction.date)}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <Badge
                                        variant={transaction.type === 'income' ? 'success' : 'danger'}
                                    >
                                        {transaction.type}
                                    </Badge>
                                </td>
                                <td className='px-6 py-4'>
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
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <Badge variant={getPaymentMethodBadgeVariant(transaction.payment_method)}>
                                        {transaction.payment_method.replace('_', ' ')}
                                    </Badge>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-right'>
                                    <div className={`text-sm font-semibold ${
                                        transaction.type === 'income'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-right'>
                                    <div className={`text-sm font-semibold ${
                                        transaction.balance >= 0
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {formatCurrency(transaction.balance)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden space-y-3'>
                {transactionsWithBalance.map((transaction) => (
                    <div
                        key={transaction.id}
                        className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4'
                    >
                        <div className='flex items-start justify-between mb-3'>
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                        {formatDate(transaction.date)}
                                    </div>
                                    <Badge
                                        variant={transaction.type === 'income' ? 'success' : 'danger'}                                    >
                                        {transaction.type}
                                    </Badge>
                                </div>
                                <div className='text-base font-semibold text-gray-900 dark:text-gray-100'>
                                    {transaction.description}
                                </div>
                                {transaction.category && (
                                    <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
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
                                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    Balance: {formatCurrency(transaction.balance)}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Badge variant={getPaymentMethodBadgeVariant(transaction.payment_method)}>
                                {transaction.payment_method.replace('_', ' ')}
                            </Badge>
                        </div>
                        {transaction.notes && (
                            <div className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                                {transaction.notes}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
