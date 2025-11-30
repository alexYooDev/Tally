import { IncomeForm } from '../income-form';
import { createIncomeTransaction, getServicesForDropdown } from '../actions';

export default async function NewIncomePage() {
    // Fetch services for dropdown
    const { data: services, error } = await getServicesForDropdown();

    if (error) {
        return (
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-800 dark:text-gray-100'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/40 dark:border-red-800'>
                    <p className='text-red-600 dark:text-red-400'>Error loading services: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:text-gray-100'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Log Income</h1>
                <p className='text-gray-600 mt-1 dark:text-gray-400'>
                    Record a new income transaction
                </p>
            </div>

            {/* Form Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'>
                <IncomeForm
                    action={createIncomeTransaction}
                    services={services || []}
                    submitLabel='Save Income'
                />
            </div>
        </div>
    );
}
