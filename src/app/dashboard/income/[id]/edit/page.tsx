import { IncomeForm } from '../../income-form';
import { updateIncomeTransaction, getIncomeTransaction, getServicesForDropdown } from '../../actions';
import { notFound } from 'next/navigation';

interface EditIncomePageProps {
    params: Promise<{
        id: string;
    }> | {
        id: string;
    };
}

export default async function EditIncomePage({ params }: EditIncomePageProps) {
    // Handle both Next.js 14 (direct params) and Next.js 15+ (Promise params)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    // Fetch the transaction and services
    const [transactionResult, servicesResult] = await Promise.all([
        getIncomeTransaction(id),
        getServicesForDropdown(),
    ]);

    if (transactionResult.error || !transactionResult.data) {
        notFound();
    }

    if (servicesResult.error) {
        return (
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-600'>Error loading services: {servicesResult.error}</p>
                </div>
            </div>
        );
    }

    const transaction = transactionResult.data;
    const services = servicesResult.data || [];

    // Create action bound to this transaction ID
    const boundUpdateAction = updateIncomeTransaction.bind(null, id);

    return (
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Edit Income</h1>
                <p className='text-gray-600 mt-1 dark:text-gray-400'>
                    Update income transaction details
                </p>
            </div>

            {/* Form Card */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8'>
                <IncomeForm
                    action={boundUpdateAction}
                    services={services}
                    submitLabel='Update Income'
                    initialData={{
                        date: transaction.date,
                        client_name: transaction.client_name || undefined,
                        service_id: transaction.service_id || undefined,
                        price: transaction.price,
                        discount: transaction.discount,
                        payment_method: transaction.payment_method,
                        notes: transaction.notes || undefined,
                    }}
                />
            </div>
        </div>
    );
}
