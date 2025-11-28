import Link from 'next/link';
import { getIncomeTransactions } from './actions';
import { DeleteIncomeButton } from './delete-button';
import { formatCurrency } from '@/lib/utils';
import type { IncomeTransactionWithService } from '@/types/supabase';

export default async function IncomePage() {
    const { data: transactions, error } = await getIncomeTransactions();

    if (error) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-600'>Error loading income transactions: {error}</p>
                </div>
            </div>
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

    // Get payment method badge color
    const getPaymentMethodBadge = (method: string) => {
        const badges: Record<string, string> = {
            cash: 'bg-green-100 text-green-700',
            card: 'bg-blue-100 text-blue-700',
            bank_transfer: 'bg-purple-100 text-purple-700',
            paypal: 'bg-indigo-100 text-indigo-700',
            other: 'bg-gray-100 text-gray-700',
        };
        return badges[method] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>Income</h1>
                    <p className='text-gray-600 mt-1'>
                        Track your income and earnings
                    </p>
                </div>
                <Link
                    href='/dashboard/income/new'
                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition'
                >
                    + Log Income
                </Link>
            </div>

            {/* Summary Cards - Horizontal on mobile */}
            {hasTransactions && (
                <div className='grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-8'>
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6'>
                        <p className='text-xs md:text-sm font-medium text-gray-600 mb-1'>
                            <span className='md:hidden'>Total Inc.</span>
                            <span className='hidden md:inline'>Total Income</span>
                        </p>
                        <p className='text-lg md:text-3xl font-bold text-indigo-600'>
                            {formatCurrency(totalIncome)}
                        </p>
                    </div>
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6'>
                        <p className='text-xs md:text-sm font-medium text-gray-600 mb-1'>
                            <span className='md:hidden'>Transaction</span>
                            <span className='hidden md:inline'>Transactions</span>
                        </p>
                        <p className='text-lg md:text-3xl font-bold text-gray-900'>
                            {transactionCount}
                        </p>
                    </div>
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6'>
                        <p className='text-xs md:text-sm font-medium text-gray-600 mb-1'>
                            <span className='md:hidden'>Avg Inc.</span>
                            <span className='hidden md:inline'>Average Transaction</span>
                        </p>
                        <p className='text-lg md:text-3xl font-bold text-gray-900'>
                            {formatCurrency(totalIncome / transactionCount)}
                        </p>
                    </div>
                </div>
            )}

            {/* Income List */}
            {!hasTransactions ? (
                /* Empty State */
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
                    <div className='text-6xl mb-4'>💰</div>
                    <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                        No income logged yet
                    </h2>
                    <p className='text-gray-600 mb-6'>
                        Start tracking your income by logging your first transaction.
                    </p>
                    <Link
                        href='/dashboard/income/new'
                        className='inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition'
                    >
                        + Log Your First Income
                    </Link>
                    {/* Quick Examples */}
                    <div className='mt-8 pt-8 border-t border-gray-200'>
                        <p className='text-sm text-gray-600 mb-4'>Examples:</p>
                        <div className='flex flex-wrap gap-2 justify-center'>
                            <span className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'>
                                Classic Full Set - $150
                            </span>
                            <span className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'>
                                Volume Fill - $80
                            </span>
                            <span className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'>
                                Consultation - $50
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop Table View - Hidden on Mobile */}
                    <div className='hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Date
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Service / Client
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Payment
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Amount
                                    </th>
                                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {transactions?.map((transaction) => (
                                    <tr key={transaction.id} className='hover:bg-gray-50 transition'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='text-sm text-gray-900'>
                                                {formatDate(transaction.date)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm text-gray-900 font-medium'>
                                                {transaction.service?.name || 'No service'}
                                            </div>
                                            {transaction.client_name && (
                                                <div className='text-sm text-gray-500'>
                                                    {transaction.client_name}
                                                </div>
                                            )}
                                            {transaction.notes && (
                                                <div className='text-xs text-gray-400 mt-1 line-clamp-1'>
                                                    {transaction.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentMethodBadge(transaction.payment_method)}`}>
                                                {transaction.payment_method.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-left'>
                                            <div className='text-sm font-semibold text-gray-900'>
                                                {formatCurrency(transaction.total_received)}
                                            </div>
                                            {transaction.discount > 0 && (
                                                <div className='text-xs text-gray-500'>
                                                    ({formatCurrency(transaction.price)} - {formatCurrency(transaction.discount)} discount)
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                            <div className='flex gap-2 justify-end'>
                                                <Link
                                                    href={`/dashboard/income/${transaction.id}/edit`}
                                                    className='px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition'
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteIncomeButton
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
                                className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'
                            >
                                {/* Header: Date and Amount */}
                                <div className='flex items-start justify-between mb-3'>
                                    <div className='flex-1'>
                                        <div className='text-xs text-gray-500 mb-1'>
                                            {formatDate(transaction.date)}
                                        </div>
                                        <div className='text-base font-semibold text-gray-900'>
                                            {transaction.service?.name || 'No service'}
                                        </div>
                                        {transaction.client_name && (
                                            <div className='text-sm text-gray-600 mt-1'>
                                                {transaction.client_name}
                                            </div>
                                        )}
                                    </div>
                                    <div className='text-right ml-4'>
                                        <div className='text-lg font-bold text-indigo-600'>
                                            {formatCurrency(transaction.total_received)}
                                        </div>
                                        {transaction.discount > 0 && (
                                            <div className='text-xs text-gray-500 mt-1'>
                                                -{formatCurrency(transaction.discount)} off
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method Badge */}
                                <div className='mb-3'>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPaymentMethodBadge(transaction.payment_method)}`}>
                                        {transaction.payment_method.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Notes */}
                                {transaction.notes && (
                                    <div className='text-sm text-gray-600 mb-3 pb-3 border-b border-gray-100'>
                                        {transaction.notes}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className='flex gap-2'>
                                    <Link
                                        href={`/dashboard/income/${transaction.id}/edit`}
                                        className='flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center'
                                    >
                                        Edit
                                    </Link>
                                    <DeleteIncomeButton
                                        transactionId={transaction.id}
                                        transactionLabel={transaction.service?.name || formatDate(transaction.date)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
