import Link from 'next/link';
import { getIncomeTransactions } from './actions';
import { IncomeActionsMenu } from './actions-menu';
import { formatCurrency } from '@/lib/utils';
import type { IncomeTransactionWithService } from '@/types/supabase';
import {
    PageContainer,
    PageHeader,
    ErrorAlert,
    SummaryCard,
    EmptyState,
    Badge,
    getPaymentMethodBadgeVariant,
} from '@/components';

export default async function IncomePage() {
    const { data: transactions, error } = await getIncomeTransactions();

    if (error) {
        return (
            <PageContainer>
                <ErrorAlert>Error loading income transactions: {error}</ErrorAlert>
            </PageContainer>
        );
    }

    const hasTransactions = transactions && transactions.length > 0;

    // Calculate summary
    const totalIncome = transactions?.reduce((sum, t) => sum + t.total_received, 0) || 0;
    const transactionCount = transactions?.length || 0;

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
        <PageContainer>
            <PageHeader
                title="Income"
                description="Track your income and earnings"
                actionLabel="+ Log Income"
                actionHref="/dashboard/income/new"
            />

            {/* Summary Cards - Horizontal on mobile */}
            {hasTransactions && (
                <div className='grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-8'>
                    <SummaryCard
                        title="Total Income"
                        shortTitle="Total Inc."
                        value={formatCurrency(totalIncome)}
                        valueColor="text-indigo-600 dark:text-indigo-400"
                    />
                    <SummaryCard
                        title="Transactions"
                        shortTitle="Transaction"
                        value={transactionCount}
                    />
                    <SummaryCard
                        title="Average Transaction"
                        shortTitle="Avg Inc."
                        value={formatCurrency(totalIncome / transactionCount)}
                    />
                </div>
            )}

            {/* Income List */}
            {!hasTransactions ? (
                <EmptyState
                    icon="💰"
                    title="No income logged yet"
                    description="Start tracking your income by logging your first transaction."
                    actionLabel="+ Log Your First Income"
                    actionHref="/dashboard/income/new"
                    examples={[
                        'Classic Full Set - $150',
                        'Volume Fill - $80',
                        'Consultation - $50',
                    ]}
                />
            ) : (
                <>
                    {/* Desktop Table View - Hidden on Mobile */}
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
                                {transactions?.map((transaction) => (
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

                    {/* Mobile Card View - Visible on Mobile Only */}
                    <div className='md:hidden space-y-3'>
                        {transactions?.map((transaction) => (
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
        </PageContainer>
    );
}
