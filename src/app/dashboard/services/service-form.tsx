// ================================================
// Service Form Component - Reusable for Create/Edit
// ================================================
'use client';

import { useState, useRef } from 'react';
import { ArrowLeftSquareIcon, PlusSquareIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServiceFormProps {
    action: (formData: FormData) => Promise<any>;
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
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await action(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If successful the action will redirect to the services page
        router.push('/dashboard/services');
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
                {!showCustomCategory && existingCategories.length > 0 ? (
                    <>
                        <select
                            id='category' 
                            name='category'
                            defaultValue={initialData?.category || ''}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
                            disabled={loading}
                        >
                            <option value="">Select a category</option>
                            {existingCategories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type='button'
                            onClick={() => setShowCustomCategory(true)}
                            className='mt-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300'
                        >
                            <PlusSquareIcon className='inline w-4 h-4 mr-2' />
                            Add Custom Category
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type='text'
                            id='category'
                            name='category'
                            defaultValue={initialData?.category || ''}
                            placeholder='e.g., Lash Extensions'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                            disabled={loading}
                        />
                        <button
                            type='button'
                            onClick={() => setShowCustomCategory(false)}
                            className='mt-2 text-sm text-indigo-600 hover:text-indigo-700'
                        >
                            <ArrowLeftSquareIcon className='inline w-4 h-4 mr-2' />
                            Choose existing category
                        </button>
                    </>
                )}
                <p className='mt-1 text-xs texy-gray-500 dark:text-gray-400'>
                    Optional - helps organize your services
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