// ================================================
// Dashboard Page - Main landing after login
// ================================================

import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                Welcome to Tally!
            </h1>
            <p className='text-gray-600'>
                Your business accounting made simple
            </p>
        </div>
        {/* Quick Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            
            {/* Income Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <div className="flex items-center justify-between mb-4">
                    <h3 className='text-sm font-medium text-gray-600'>
                        Total Income
                    </h3>
                    <span className='text-2xl'>💰</span>
                </div>
                <p className='text-3xl font-bold text-gray-900'>$0.00</p>
                <p className='text-sm text-gray-500 mt-2'>
                    No transactions yet
                </p>
            </div>
            {/* Spending Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-sm font-medium text-gray-600'>
                        Total Spending
                    </h3>
                    <span className='text-2xl'>💸</span>
                </div>
                <p className='text-3xl font-bold text-gray-900'>$0.00</p>
                <p className='text-sm text-gray-500 mt-2'>
                    No transactions yet
                </p>
            </div>

            {/* Net Profit Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-sm font-medium text-gray-600'>
                        Net Profit
                    </h3>
                    <span className='text-2xl'>💰</span>
                </div>
                <p className='text-3xl font-bold text-gray-900'>$0.00</p>
                <p className='text-sm text-gray-500 mt-2'>
                    Start tracking today!
                </p>
            </div>
        </div>
        {/* Getting Started */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
            🚀 Getting Started
            </h2>
            
            <div className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">1</span>
                </div>
                <div>
                <h3 className="font-medium text-gray-900 mb-1">
                    Set up your services
                </h3>
                <p className="text-sm text-gray-600">
                    Add the services or products you offer with their prices
                </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">2</span>
                </div>
                <div>
                <h3 className="font-medium text-gray-900 mb-1">
                    Log your first income
                </h3>
                <p className="text-sm text-gray-600">
                    Record revenue from your services
                </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">3</span>
                </div>
                <div>
                <h3 className="font-medium text-gray-900 mb-1">
                    Track your spending
                </h3>
                <p className="text-sm text-gray-600">
                    Record business expenses and supplies
                </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">4</span>
                </div>
                <div>
                <h3 className="font-medium text-gray-900 mb-1">
                    View your insights
                </h3>
                <p className="text-sm text-gray-600">
                    Watch your dashboard come alive with real data
                </p>
                </div>
            </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
                Ready to start? Coming soon:
            </p>
            <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                Log Income (Coming Soon)
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                Log Spending (Coming Soon)
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                Manage Services (Coming Soon)
                </button>
            </div>
            </div>
        </div>

        {/* User Info (Debug) */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
            Account Info
            </h3>
            <p className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
            User ID: <span className="font-mono text-xs">{user?.id}</span>
            </p>
        </div>
      </div> 
    );
}