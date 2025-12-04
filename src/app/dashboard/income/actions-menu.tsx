'use client';

import { EntityActionsMenu } from '@/components';
import { deleteIncomeTransaction } from './actions';

interface IncomeActionsMenuProps {
    transactionId: string;
    transactionLabel: string;
}

export function IncomeActionsMenu({ transactionId, transactionLabel }: IncomeActionsMenuProps) {
    return (
        <EntityActionsMenu
            entityId={transactionId}
            entityLabel={transactionLabel}
            editPath={`/dashboard/income/${transactionId}/edit`}
            redirectPath="/dashboard/income"
            onDelete={deleteIncomeTransaction}
        />
    );
}
