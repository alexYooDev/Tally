import { Suspense } from 'react';
import { getSpendingTransactions, getSpendingCategories } from './actions';
import { SpendingList } from './spending-list';
import {
    PageContainer,
    PageHeader,
    EmptyState,
} from '@/components';
import { PageLoading } from '@/components';
import { ErrorBoundary } from '@/components';

async function SpendingContent() {
    const { data: transactions, error } = await getSpendingTransactions();
    const { data: categories } = await getSpendingCategories();

    if (error) {
        throw new Error(error);
    }

    const hasTransactions = transactions && transactions.length > 0;

    return (
        <>
            {/* Spending List */}
            {!hasTransactions ? (
                <EmptyState
                    icon="💸"
                    title="No spending logged yet"
                    description="Start tracking your expenses by logging your first transaction."
                    actionLabel="+ Log Your First Spending"
                    actionHref="/dashboard/spending/new"
                    examples={[
                        'Supplies - $120',
                        'Rent - $1,500',
                        'Marketing - $250',
                    ]}
                />
            ) : (
                <SpendingList transactions={transactions} categories={categories || []} />
            )}
        </>
    );
}

export default function SpendingPage() {
    return (
        <PageContainer>
            <PageHeader
                title="Spending"
                description="Track your expenses and spending"
                actionLabel="+ Log Spending"
                actionHref="/dashboard/spending/new"
            />
            <ErrorBoundary>
                <Suspense fallback={<PageLoading />}>
                    <SpendingContent />
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
}
