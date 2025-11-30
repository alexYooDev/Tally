// ================================================
// Delete Income Button - Client Component
// ================================================
'use client';

import { useState } from 'react';
import { deleteIncomeTransaction } from './actions';
import { useRouter } from 'next/navigation';

interface DeleteIncomeButtonProps {
    transactionId: string;
    transactionLabel: string;
}

export function DeleteIncomeButton({ transactionId, transactionLabel }: DeleteIncomeButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteIncomeTransaction(transactionId);

        if (result?.error) {
            alert(`Error: ${result.error}`);
            setIsDeleting(false);
            setShowConfirm(false);
        } else {
            // If successful, page will revalidate automatically
            router.push('/dashboard/income');
        }
    }

    if (showConfirm) {
        return (
            <div className='flex-1 flex gap-1'>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className='flex-1 px-2 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className='px-2 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className='flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 cursor-pointer'
        >
            Delete
        </button>
    );
}
