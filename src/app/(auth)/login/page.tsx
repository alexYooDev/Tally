// ================================================
// Login Page
// ================================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../actions';

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
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Welcome back!
                </h2>
                <p className='text-gray-600'>
                    Sign in to your Tally account
                </p>
            </div>
            {/* Error Message */}
            { error && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-sm text-red-600'>
                        {error}
                    </p>
                </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email */}
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email
                    </label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='your@email.com'
                    />
                </div>
                {/* Password */}
                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                        Password
                    </label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        required
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='••••••••'
                        disabled={loading}
                    />
                    <Link href='/forgot-password' className='text-sm text-indigo-600 hover:text-indigo-500'>
                        Forgot your password?
                    </Link>
                </div>
                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-indigo-600 text-white py-3 py-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                        ) : (
                        'Sign in'
                    )}
                </button>
            </form>
            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        href="/signup"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}