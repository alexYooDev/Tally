// ================================================
// Dashboard Layout - Protected routes
// ================================================
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/(auth)/actions';

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
        <div className='min-h-screen bg-gray-50'>
            {/* Top Navigation */}
            <nav className='bg-white shadow-sm border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        {/* Logo */}
                        <div className='flex items-center'>
                            <h1 className='text-2xl font-bold text-indigo-600'>
                                Tally
                            </h1>
                        </div>
                        {/* User Menu */}
                        <div className='flex items-center gap-4'>
                            <span className='text-sm text-gray-600'>
                                {user.email}
                            </span>
                            <form action={logout}>
                                <button
                                    type='submit'
                                    className='text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer'
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
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