// ================================================
// Analytics Component - Charts and Data Visualization
// ================================================
'use client';

import { useState, useMemo } from 'react';
import type { CashFlowTransaction } from '@/app/dashboard/actions';
import type { TimeRange } from '@/lib/analytics';
import {
    filterByTimeRange,
    aggregateByDay,
    aggregateByCategory,
    aggregateByPaymentMethod,
} from '@/lib/analytics';
import { IncomeSpendingChart } from './charts/income-spending-chart';
import { CategoryBreakdownChart } from './charts/category-breakdown-chart';
import { PaymentMethodChart } from './charts/payment-method-chart';

interface AnalyticsProps {
    transactions: CashFlowTransaction[];
}

export function Analytics({ transactions }: AnalyticsProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');

    // Filter transactions based on selected time range
    const filteredTransactions = useMemo(() => {
        return filterByTimeRange(transactions, timeRange);
    }, [transactions, timeRange]);

    // Aggregate data for charts
    const dailyData = useMemo(() => {
        return aggregateByDay(filteredTransactions);
    }, [filteredTransactions]);

    const categoryData = useMemo(() => {
        return aggregateByCategory(filteredTransactions);
    }, [filteredTransactions]);

    const paymentMethodData = useMemo(() => {
        return aggregateByPaymentMethod(filteredTransactions);
    }, [filteredTransactions]);

    const timeRangeOptions: { value: TimeRange; label: string }[] = [
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' },
        { value: 'all', label: 'All time' },
    ];

    if (transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-medium mb-2">No data to analyze yet</h3>
                    <p className="text-sm">
                        Start logging income and spending to see your financial analytics
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Time Range Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    📊 Financial Analytics
                </h2>
                <div className="flex flex-wrap gap-2">
                    {timeRangeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setTimeRange(option.value)}
                            className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition whitespace-nowrap ${
                                timeRange === option.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Income vs Spending Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 overflow-hidden">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                        Income vs Spending Trend
                    </h3>
                    <IncomeSpendingChart data={dailyData} />
                </div>

                {/* Category Breakdown Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 overflow-hidden">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                        Spending by Category
                    </h3>
                    <CategoryBreakdownChart data={categoryData} />
                </div>

                {/* Payment Method Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:col-span-2 overflow-hidden">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                        Payment Method Distribution
                    </h3>
                    <PaymentMethodChart data={paymentMethodData} />
                </div>
            </div>
        </div>
    );
}
