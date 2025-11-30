// ================================================
// Auth Layout - Shared layout for login/signup
// ================================================

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data : { user } } = await supabase.auth.getUser();

    if (user) {
        redirect('/dashboard');
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Logo/Brand */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-black dark:text-white mb-2'>Tally</h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Simple accounting for small businesses
                    </p>
                </div>
                {/* Auth Card */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
                    {children}
                </div>

                {/* Footer */}
                <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-8'>
                    © {new Date().getFullYear()} Tally. All rights reserved.
                </p>
            </div>
        </div>
    );
}