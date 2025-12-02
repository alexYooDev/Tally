// ================================================
// Signup Page
// ================================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '../actions';
import { ErrorAlert, SuccessAlert, Button } from '@/components';

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
            {error && (
                <ErrorAlert className="mb-6">{error}</ErrorAlert>
            )}
            {/* Success Message */}
            {success && (
                <SuccessAlert className="mb-6">{success}</SuccessAlert>
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
                <Button
                    type='submit'
                    loading={loading}
                    className='w-full'
                >
                    {loading ? 'Signing up...' : 'Sign up'}
                </Button>
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