import { SpendingForm } from '../../spending-form';
import { getSpendingTransaction, updateSpendingTransaction, getSpendingCategories } from '../../actions';
import { notFound } from 'next/navigation';

interface EditSpendingPageProps {
    params: Promise<{
        id: string;
    }> | {
        id: string;
    };
}

export default async function EditSpendingPage({ params }: EditSpendingPageProps) {
    // Handle both Next.js 14 (direct params) and Next.js 15+ (Promise params)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    // Fetch the spending transaction and categories in parallel
    const [transactionResult, categoriesResult] = await Promise.all([
        getSpendingTransaction(id),
        getSpendingCategories(),
    ]);

    if (transactionResult.error || !transactionResult.data) {
        notFound();
    }

    if (categoriesResult.error) {
        return (
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-600'>Error loading categories: {categoriesResult.error}</p>
                </div>
            </div>
        );
    }

    const transaction = transactionResult.data;
    const categories = categoriesResult.data || [];

    // Create action bound to this transaction ID
    const boundUpdateAction = updateSpendingTransaction.bind(null, id);

    return (
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Edit Spending</h1>
                <p className='text-gray-600 mt-1 dark:text-gray-400'>
                    Update spending transaction details
                </p>
            </div>

            {/* Form Card */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8'>
                <SpendingForm
                    action={boundUpdateAction}
                    categories={categories}
                    submitLabel='Update Spending'
                    initialData={{
                        date: transaction.date,
                        description: transaction.description,
                        category: transaction.category?.name,
                        amount: transaction.amount,
                        payment_method: transaction.payment_method,
                        notes: transaction.notes || undefined,
                    }}
                />
            </div>
        </div>
    );
}
