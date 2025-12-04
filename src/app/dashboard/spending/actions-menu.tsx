'use client';

import { EntityActionsMenu } from '@/components';
import { deleteSpendingTransaction } from './actions';

interface SpendingActionsMenuProps {
    transactionId: string;
    transactionLabel: string;
}

export function SpendingActionsMenu({ transactionId, transactionLabel }: SpendingActionsMenuProps) {
    return (
        <EntityActionsMenu
            entityId={transactionId}
            entityLabel={transactionLabel}
            editPath={`/dashboard/spending/${transactionId}/edit`}
            redirectPath="/dashboard/spending"
            onDelete={deleteSpendingTransaction}
        />
    );
}
