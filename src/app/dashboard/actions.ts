// ================================================
// Dashboard Actions - Combined data fetching
// ================================================
'use server';

import { getIncomeTransactions } from './income/actions';
import { getSpendingTransactions } from './spending/actions';

export type CashFlowTransaction = {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'spending';
    payment_method: string;
    category?: string;
    notes?: string | null;
};

/**
 * Get all transactions (income + spending) for cash flow view
 */
export async function getCashFlowTransactions() {
    // Fetch both income and spending
    const [incomeResult, spendingResult] = await Promise.all([
        getIncomeTransactions(),
        getSpendingTransactions(),
    ]);

    if (incomeResult.error) {
        return { error: incomeResult.error };
    }

    if (spendingResult.error) {
        return { error: spendingResult.error };
    }

    const income = incomeResult.data || [];
    const spending = spendingResult.data || [];

    // Transform income transactions
    const incomeTransactions: CashFlowTransaction[] = income.map((t) => ({
        id: t.id,
        date: t.date,
        description: t.service?.name || t.client_name || 'Income',
        amount: t.total_received,
        type: 'income' as const,
        payment_method: t.payment_method,
        category: t.service?.category?.name,
        notes: t.notes,
    }));

    // Transform spending transactions
    const spendingTransactions: CashFlowTransaction[] = spending.map((t) => ({
        id: t.id,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: 'spending' as const,
        payment_method: t.payment_method,
        category: t.category?.name,
        notes: t.notes,
    }));

    // Combine and sort by date (newest first)
    const allTransactions = [...incomeTransactions, ...spendingTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return { data: allTransactions };
}
