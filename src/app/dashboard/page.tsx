// ================================================
// Dashboard Page - Main landing after login
// ================================================

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { PageContainer, StatCard } from '@/components';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch real income data
    const { data: incomeData } = await supabase
        .from('income_transactions')
        .select('total_received')
        .eq('user_id', user?.id || '');

    const { data: spendingData } = await supabase
        .from('spending_transactions')
        .select('amount')
        .eq('user_id', user?.id || '');

    // Calculate totals
    const totalIncome = (incomeData as { total_received: number }[] | null)?.reduce((sum, t) => sum + t.total_received, 0) || 0;
    const totalSpending = (spendingData as { amount: number }[] | null)?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const netProfit = totalIncome - totalSpending;
    const incomeCount = incomeData?.length || 0;
    const spendingCount = spendingData?.length || 0;

    return (
      <PageContainer>
        {/* Welcome Section */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                Welcome to Tally!
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
                Your business accounting made simple
            </p>
        </div>
        {/* Quick Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <StatCard
                label="Total Income"
                value={formatCurrency(totalIncome)}
                icon="💰"
                description={incomeCount > 0 ? `${incomeCount} transaction${incomeCount !== 1 ? 's' : ''}` : 'No transactions yet'}
                valueColor="text-green-600 dark:text-green-400"
            />
            <StatCard
                label="Total Spending"
                value={formatCurrency(totalSpending)}
                icon="💸"
                description={spendingCount > 0 ? `${spendingCount} transaction${spendingCount !== 1 ? 's' : ''}` : 'No transactions yet'}
                valueColor="text-red-600 dark:text-red-400"
            />
            <StatCard
                label="Net Profit"
                value={formatCurrency(netProfit)}
                icon={ netProfit > 0 ? "🤑" : "🫩"}
                description={incomeCount > 0 ? 'Income - Spending' : 'Start tracking today!'}
                valueColor={netProfit >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}
            />
        </div>
        
        {/* Getting Started */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                🏦 Getting Started
            </h2>

            {/* Horizontal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="border-2 border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Set up services
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Add the services or products you offer with their prices
                    </p>
                    <Link href='/dashboard/services'>
                        <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer">
                            Go to my services →
                        </button>
                    </Link>
                </div>

                {/* Step 2 */}
                <div className="border-2 border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Log income
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Record revenue from your services and clients
                    </p>
                    <Link href='/dashboard/income'>
                        <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer">
                            Go to my income →
                        </button>
                    </Link>
                </div>

                {/* Step 3 */}
                <div className="border-2 border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Track spending
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Record business expenses and supplies
                    </p>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer">
                        Go to my spending →
                    </button>
                </div>

                {/* Step 4 */}
                <div className="border-2 border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        View insights
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Watch your dashboard come alive with real data
                    </p>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer">
                        Coming soon →
                    </button>
                </div>
            </div>
        </div>

        {/* User Info (Debug) */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
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