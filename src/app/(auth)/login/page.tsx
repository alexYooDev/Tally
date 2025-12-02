// ================================================
// Login Page
// ================================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../actions';
import { ErrorAlert, Button } from '@/components';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        /* Success - redirect to dashboard */
        if (result?.success) {
            router.push('/dashboard');
            router.refresh();
        }
    }
    return (
        <div>
            {/* Header */}
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    Welcome back!
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                    Sign in to your Tally account
                </p>
            </div>
            {/* Error Message */}
            {error && (
                <ErrorAlert className="mb-6">{error}</ErrorAlert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email */}
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Email
                    </label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        className='mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                        placeholder='your@email.com'
                    />
                </div>
                {/* Password */}
                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Password
                    </label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        required
                        className='mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        placeholder='••••••••'
                        disabled={loading}
                    />
                    <Link href='/forgot-password' className='text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300'>
                        Forgot your password?
                    </Link>
                </div>
                {/* Submit Button */}
                <Button
                    type='submit'
                    loading={loading}
                    className='w-full'
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        href="/signup"
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}