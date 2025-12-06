// ================================================
// Dashboard Page - Main landing after login
// ================================================

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PageContainer, Analytics } from '@/components';
import { getCashFlowTransactions } from './actions';
import { CashFlow } from './cash-flow';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch combined cash flow data
    const { data: transactions } = await getCashFlowTransactions();
    const hasTransactions = transactions && transactions.length > 0;

    return (
      <PageContainer>
        {/* Welcome Section */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-2'>
                <span className='text-gray-900 dark:text-gray-100'>Welcome to </span>
                <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                    Tally!
                </span>
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
                Your business accounting made simple
            </p>
        </div>

        {/* Cash Flow Section */}
        {hasTransactions && (
            <div id="cash-flow" className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    💵 <span>Cash Flow Timeline</span>
                </h2>
                <CashFlow transactions={transactions} />
            </div>
        )}

        {/* Analytics Section */}
        {hasTransactions && (
            <div className="mb-8">
                <Analytics transactions={transactions} />
            </div>
        )}
        {/* User Info (Debug) */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Account Info
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
            Logged in as: <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            User ID: <span className="font-mono text-xs">{user?.id}</span>
            </p>
        </div>
      </PageContainer>
    );
}