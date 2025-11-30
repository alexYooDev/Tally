// ================================================
// Signup Page
// ================================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '../actions';

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        /* initalize to default */
        setError('');
        setSuccess('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await signup(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else if (result?.message) {
            setSuccess(result.message);
            setLoading(false);
        } else if (result?.success) {
            /* Success without email confirmation - redirect to dashboard */
            router.push('/dashboard');
            router.refresh();
        }
    }
    return (
        <div>
            {/* Header */}
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    Create your account
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                    Start tracking your business money flow today
                </p>
            </div>
            {/* Error Message */}
            { error && (
                <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                    <p className='text-sm text-red-600 dark:text-red-400'>
                        {error}
                    </p>
                </div>
            )}
            {/* Success Message */}
            { success && (
                <div className='mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                    <p className='text-sm text-green-600 dark:text-green-400'>
                        {success}
                    </p>
                </div>
            )}
            {/* Signup Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Eamil field */}
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
                        disabled={loading}
                    />
                </div>
                {/* Password field */}
                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Password
                    </label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='new-password'
                        required
                        className='mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        placeholder='••••••••'
                        disabled={loading}
                    />
                    <p className='mt-1 text-ts text-gray-500 dark:text-gray-400'>
                        At least 6 characters
                    </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Confirm Password
                    </label>
                    <input
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        autoComplete='new-password'
                        required
                        minLength={6}
                        className='mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        placeholder='••••••••'
                        disabled={loading}
                    />
                </div>
                {/* Terms Checkbox */}
                <div className="flex items-start">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        disabled={loading}
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                        I agree to the{' '}
                        <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                        Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                        Privacy Policy
                        </Link>
                    </label>
                    </div>
                {/* Sign Up Button */}
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 py-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing up...
                        </span>
                        ) : (
                            'Sign up'
                        )}
                </button>
                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                            >
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}