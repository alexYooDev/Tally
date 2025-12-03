// ================================================
// Spending Form Component - Reusable for Create/Edit
// ================================================
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CategorySelectWithDelete } from '@/components';
import { deleteCategory } from './actions';
import type { CategoryMinimal } from './actions';

interface SpendingFormProps {
    action: (formData: FormData) => Promise<any>;
    categories: CategoryMinimal[];
    submitLabel: string;
    initialData?: {
        date?: string;
        description?: string;
        category?: string;
        amount?: number;
        payment_method?: string;
        notes?: string;
    };
}

export function SpendingForm({
    action,
    categories,
    submitLabel,
    initialData,
}: SpendingFormProps) {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [categoryInput, setCategoryInput] = useState<string>(initialData?.category || '');
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await action(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // If successful, redirect to spending page
            router.push('/dashboard/spending');
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className='space-y-6 dark:bg-gray-800 dark:text-gray-100'>
            {/* Error Message */}
            {error && (
                <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                    <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
                </div>
            )}

            {/* Date */}
            <div>
                <label htmlFor='date' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Date *
                </label>
                <input
                    type='date'
                    id='date'
                    name='date'
                    required
                    defaultValue={initialData?.date || today}
                    max={today}
                    className='w-full px-3 md:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    disabled={loading}
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Description *
                </label>
                <input
                    type='text'
                    id='description'
                    name='description'
                    required
                    defaultValue={initialData?.description || ''}
                    placeholder='e.g., Office supplies, Marketing expenses'
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                    disabled={loading}
                />
            </div>

            {/* Category */}
            <div>
                <label htmlFor='category' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Category
                </label>
                <div className='relative'>
                    <input
                        type='text'
                        id='category'
                        name='category'
                        list='category-suggestions'
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder='e.g., Supplies, Rent, Marketing'
                        className='w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                        disabled={loading}
                    />
                    {categoryInput && (
                        <button
                            type='button'
                            onClick={() => setCategoryInput('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                            aria-label='Clear category'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                            </svg>
                        </button>
                    )}
                    <datalist id='category-suggestions'>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name} />
                        ))}
                    </datalist>
                </div>
                <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Optional - type to search or create new category
                </p>
            </div>

            {/* Amount */}
            <div>
                <label htmlFor='amount' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Amount *
                </label>
                <div className='relative'>
                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
                        $
                    </span>
                    <input
                        type='number'
                        id='amount'
                        name='amount'
                        required
                        min='0'
                        step='0.01'
                        defaultValue={initialData?.amount || ''}
                        className='w-full pl-7 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        disabled={loading}
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label htmlFor='payment_method' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Payment Method *
                </label>
                <select
                    id='payment_method'
                    name='payment_method'
                    required
                    defaultValue={initialData?.payment_method || ''}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    disabled={loading}
                >
                    <option value=''>Select payment method</option>
                    <option value='cash'>Cash</option>
                    <option value='card'>Card</option>
                    <option value='bank_transfer'>Bank Transfer</option>
                    <option value='paypal'>PayPal</option>
                    <option value='other'>Other</option>
                </select>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor='notes' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Notes
                </label>
                <textarea
                    id='notes'
                    name='notes'
                    rows={3}
                    defaultValue={initialData?.notes || ''}
                    placeholder='e.g., Monthly subscription, one-time purchase'
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                    disabled={loading}
                />
                <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Optional - add any additional details
                </p>
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                    {loading ? (
                        <span className='flex items-center justify-center'>
                            <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        submitLabel
                    )}
                </button>
                <a
                    href='/dashboard/spending'
                    className='px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition'
                >
                    Cancel
                </a>
            </div>
        </form>
    );
}
