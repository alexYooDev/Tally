'use client';

import Link from 'next/link';
import { DropdownMenu, DropdownMenuItem } from '@/components/dropdown-menu';
import { deleteSpendingTransaction } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SpendingActionsMenuProps {
    transactionId: string;
    transactionLabel: string;
}

export function SpendingActionsMenu({ transactionId, transactionLabel }: SpendingActionsMenuProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteSpendingTransaction(transactionId);

        if (result?.error) {
            alert(`Error: ${result.error}`);
            setIsDeleting(false);
            setShowConfirm(false);
        } else {
            router.push('/dashboard/spending');
        }
    }

    if (showConfirm) {
        return (
            <div className='flex gap-1'>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className='px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className='px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <Link href={`/dashboard/spending/${transactionId}/edit`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem variant="danger" onClick={() => setShowConfirm(true)}>
                Delete
            </DropdownMenuItem>
        </DropdownMenu>
    );
}
