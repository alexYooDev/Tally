// ================================================
// Dashboard Layout - Protected routes
// ================================================
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/(auth)/actions';
import Link from 'next/link';
import { MobileNav } from '@/components';

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    /* Check authentication */
    if (!user) {
        redirect('/login');
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Top Navigation */}
            <nav className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        {/* Logo & Navigation*/}
                        <div className='flex items-center gap-8'>
                            <Link
                                href='/dashboard'
                                className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
                                Tally.
                            </Link>
                            {/* Nav Links */}
                            <div className='hidden md:flex items-center gap-6'>
                                <Link
                                    href='/dashboard'
                                    className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition'
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href='/dashboard/services'
                                    className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition'
                                >
                                    Services
                                </Link>
                                <Link
                                    href='/dashboard/income'
                                    className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition'
                                >
                                    Income
                                </Link>
                                <Link
                                    href='/dashboard/spending'
                                    className='text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition'
                                >
                                    Spending
                                </Link>
                            </div>
                        </div>
                        {/* User Menu - Desktop */}
                        <div className='hidden md:flex items-center gap-4'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                                {user.email}
                            </span>
                            <form action={logout}>
                                <button
                                    type='submit'
                                    className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium cursor-pointer'
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>

                        {/* Mobile Menu */}
                        <MobileNav userEmail={user.email || ''} logoutAction={logout} />
                    </div>
                </div>
            </nav>
            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    )
};