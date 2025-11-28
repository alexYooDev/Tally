// ================================================
// Income Form Component - Reusable for Create/Edit
// ================================================
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ServiceMinimal } from '@/types/supabase';

interface IncomeFormProps {
    action: (formData: FormData) => Promise<any>;
    services: ServiceMinimal[];
    submitLabel: string;
    initialData?: {
        date?: string;
        client_name?: string;
        service_id?: string;
        price?: number;
        discount?: number;
        payment_method?: string;
        notes?: string;
    };
}

export function IncomeForm({
    action,
    services,
    submitLabel,
    initialData,
}: IncomeFormProps) {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState<number>(initialData?.price || 0);
    const [discount, setDiscount] = useState<number>(initialData?.discount || 0);
    const [selectedServiceId, setSelectedServiceId] = useState<string>(initialData?.service_id || '');
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // Auto-fill price when service is selected
    useEffect(() => {
        if (selectedServiceId && !initialData) {
            const selectedService = services.find(s => s.id === selectedServiceId);
            if (selectedService) {
                setPrice(selectedService.default_price);
            }
        }
    }, [selectedServiceId, services, initialData]);

    // Calculate total received
    const totalReceived = price - discount;

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
            // If successful, redirect to income page
            router.push('/dashboard/income');
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className='space-y-6'>
            {/* Error Message */}
            {error && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-sm text-red-600'>{error}</p>
                </div>
            )}

            {/* Date */}
            <div>
                <label htmlFor='date' className='block text-sm font-medium text-gray-700 mb-2'>
                    Date *
                </label>
                <input
                    type='date'
                    id='date'
                    name='date'
                    required
                    defaultValue={initialData?.date || today}
                    max={today}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                    disabled={loading}
                />
            </div>

            {/* Service Selection */}
            <div>
                <label htmlFor='service_id' className='block text-sm font-medium text-gray-700 mb-2'>
                    Service
                </label>
                <select
                    id='service_id'
                    name='service_id'
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                    disabled={loading}
                >
                    <option value=''>Select a service (optional)</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name} - ${service.default_price.toFixed(2)}
                        </option>
                    ))}
                </select>
                <p className='mt-1 text-xs text-gray-500'>
                    Optional - selecting a service will auto-fill the price
                </p>
            </div>

            {/* Client Name */}
            <div>
                <label htmlFor='client_name' className='block text-sm font-medium text-gray-700 mb-2'>
                    Client Name
                </label>
                <input
                    type='text'
                    id='client_name'
                    name='client_name'
                    defaultValue={initialData?.client_name || ''}
                    placeholder='e.g., Sarah Johnson'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                    disabled={loading}
                />
                <p className='mt-1 text-xs text-gray-500'>
                    Optional - helps track repeat clients
                </p>
            </div>

            {/* Price & Discount - Side by Side */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Price */}
                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-2'>
                        Price *
                    </label>
                    <div className='relative'>
                        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
                            $
                        </span>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            required
                            min='0'
                            step='0.01'
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                            className='w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Discount */}
                <div>
                    <label htmlFor='discount' className='block text-sm font-medium text-gray-700 mb-2'>
                        Discount
                    </label>
                    <div className='relative'>
                        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
                            $
                        </span>
                        <input
                            type='number'
                            id='discount'
                            name='discount'
                            min='0'
                            step='0.01'
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            className='w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Total Received - Calculated Display */}
            <div className='bg-indigo-50 border border-indigo-200 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-indigo-900'>
                        Total Received
                    </span>
                    <span className='text-2xl font-bold text-indigo-600'>
                        ${totalReceived.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label htmlFor='payment_method' className='block text-sm font-medium text-gray-700 mb-2'>
                    Payment Method *
                </label>
                <select
                    id='payment_method'
                    name='payment_method'
                    required
                    defaultValue={initialData?.payment_method || ''}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
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
                <label htmlFor='notes' className='block text-sm font-medium text-gray-700 mb-2'>
                    Notes
                </label>
                <textarea
                    id='notes'
                    name='notes'
                    rows={3}
                    defaultValue={initialData?.notes || ''}
                    placeholder='e.g., First time client, referred by Jessica'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
                    disabled={loading}
                />
                <p className='mt-1 text-xs text-gray-500'>
                    Optional - add any additional details
                </p>
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-4 border-t border-gray-200'>
                <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed'
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
                    href='/dashboard/income'
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition'
                >
                    Cancel
                </a>
            </div>
        </form>
    );
}
