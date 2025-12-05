// ================================================
// Reusable Entity Actions Menu Component
// ================================================
'use client';

import Link from 'next/link';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toast } from "sonner";

interface EntityActionsMenuProps {
    entityId: string;
    entityLabel: string;
    editPath: string;
    redirectPath: string;
    onDelete: (id: string) => Promise<{ success?: boolean; error?: string; message?: string }>;
}

export function EntityActionsMenu({
    entityId,
    entityLabel,
    editPath,
    redirectPath,
    onDelete,
}: EntityActionsMenuProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        setIsDeleting(true);
        try {
            const result = await onDelete(entityId);

            if (result?.error) {
                toast.error(result.error);
                setIsDeleting(false);
                setShowConfirm(false);
            } else {
                toast.success(result.message || `${entityLabel} deleted successfully`);
                router.push(redirectPath);
                router.refresh();
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            setIsDeleting(false);
            setShowConfirm(false);
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
            <Link href={editPath}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DropdownMenuItem variant="destructive" onClick={() => setShowConfirm(true)}>
                Delete
            </DropdownMenuItem>
        </DropdownMenu>
    );
}
