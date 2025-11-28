// ================================================
// Dashboard Page - Main landing after login
// ================================================

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

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
                    <span className='text-2xl'>🤑</span>
                </div>
                <p className='text-3xl font-bold text-gray-900'>$0.00</p>
                <p className='text-sm text-gray-500 mt-2'>
                    Start tracking today!
                </p>
            </div>
        </div>
        
        {/* Getting Started */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                🏦 Getting Started
            </h2>   
        
            {/* Horizontal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="border-2 border-indigo-100 rounded-xl p-6 hover:border-indigo-200 transition">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Set up services
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add the services or products you offer with their prices
                    </p>
                    <Link href='/dashboard/services'>
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">
                            Go to my services →
                        </button>
                    </Link>
                </div>

                {/* Step 2 */}
                <div className="border-2 border-indigo-100 rounded-xl p-6 hover:border-indigo-200 transition">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Log income
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Record revenue from your services and clients
                    </p>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">
                        Coming soon →
                    </button>
                </div>

                {/* Step 3 */}
                <div className="border-2 border-indigo-100 rounded-xl p-6 hover:border-indigo-200 transition">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Track spending
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Record business expenses and supplies
                    </p>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">
                        Coming soon →
                    </button>
                </div>

                {/* Step 4 */}
                <div className="border-2 border-indigo-100 rounded-xl p-6 hover:border-indigo-200 transition">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        View insights
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Watch your dashboard come alive with real data
                    </p>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">
                        Coming soon →
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