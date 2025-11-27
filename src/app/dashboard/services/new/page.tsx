// ================================================
// Add New Service Page
// ================================================

import Link from 'next/link';
import { createService, getServiceCategories } from '../actions';
import { ServiceForm } from '../service-form';
import { ArrowLeftIcon } from 'lucide-react';

export default async function NewServicePage() {
    const { data: categories } = await getServiceCategories();
    
    return (
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            {/* Header */}
            <div className='mb-8'>
                <Link
                    href='/dashboard/services'
                    className='text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-4 inline-block'
                >
                    <ArrowLeftIcon className='inline w-4 h-4 mr-2' />
                    Back to Services
                </Link>
                <h1 className='text-3xl font-bold text-gray-900'>Add New Service</h1>
                <p className='text-gray-600 mt-1'>
                    Create a new service for your business
                </p>
            </div>
            {/* Form */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
                <ServiceForm
                    action={createService}
                    existingCategories={categories || []}
                    submitLabel='Create Service'
                />
            </div>
            {/* Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <span className="text-2xl mr-3">💡</span>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">Tips:</p>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Use clear, descriptive names (e.g., "Classic Full Set" not "CFS")</li>
                            <li>Categories help organize services (e.g., "Lash Extensions", "Tinting")</li>
                            <li>Set your regular price - you can discount later when logging income</li>
                            <li>Add a description to remember details (e.g., "Takes 90 minutes")</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}