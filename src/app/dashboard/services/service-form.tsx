// ================================================
// Service Form Component - Reusable for Create/Edit
// ================================================
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ServiceFormProps {
    action: (formData: FormData) => Promise<{ success?: boolean; error?: string; message?: string }>;
    existingCategories: Array<{id: string; name: string}>;
    submitLabel: string;
    initialData?: {
        name?: string;
        category?: string;
        default_price?: number;
        description?: string;
    };
}

export function ServiceForm({
    action,
    existingCategories,
    submitLabel,
    initialData,
}: ServiceFormProps) {

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [categoryInput, setCategoryInput] = useState<string>(initialData?.category || '');
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await action(formData);

            if (result?.error) {
                toast.error(result.error);
                setError(result.error);
                setLoading(false);
            } else {
                toast.success(result.message || 'Service saved successfully');
                // If successful the action will redirect to the services page
                router.push('/dashboard/services');
                router.refresh();
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            setError('An unexpected error occurred');
            setLoading(false);
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className='space-y-6'>
            {/* Error Message */}
            { error && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/40 dark:border-red-800'>
                    <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
                </div>
            )}
            {/* Service Name */}
            <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100'>
                    Service Name *
                </label>
                <input 
                    type='text'
                    id='name'
                    name='name'
                    required
                    defaultValue={initialData?.name}
                    placeholder='e.g., Classic Full Set'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
                    disabled={loading}
                />
            </div>
            {/* Category */}
            <div>
                <label
                    htmlFor='category'
                    className='block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100'
                >
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
                        placeholder='e.g., Lash Extensions, Nails, Hair'
                        className='w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
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
                        {existingCategories.map((category) => (
                            <option key={category.id} value={category.name} />
                        ))}
                    </datalist>
                </div>
                <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Optional - type to search or create new category
                </p>
            </div>
            {/* Prices */}
            <div>
                <label htmlFor='default' className='block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100'>
                    Default Price
                </label>
                <div className='relative'>
                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
                        $
                    </span>
                    <input 
                        type='number'  
                        id='default_price' 
                        name='default_price'
                        required min='0' 
                        step='0.01'
                        defaultValue={initialData?.default_price || ''}
                        className='w-full px-7 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
                        disabled={loading}  
                    />
                </div>
                <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    You can apply discounts when logging incomes
                </p>
            </div>

            {/* Description */}
            <div>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100'>
                    Description
                </label>
                <textarea 
                    id='description'
                    name='description'
                    rows={3}
                    defaultValue={initialData?.description}
                    placeholder='e.g., Takes approximately 90 minutes, includes consultation.'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700' 
                    disabled={loading}
                />
                <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Optional - add notes about duration, what's included, etc.
                </p>
            </div>
            {/* Actions */}
            <div className='flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:focus:ring-indigo-800'
                >
                    {loading ? (
                        <span className='flex items-center justify-center'>
                            <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        submitLabel
                    )}
                </button>
                <a 
                    href='/dashboard/services'
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'
                >
                    Cancel
                </a>
            </div>
        </form>
    );
}