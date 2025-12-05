import { Suspense } from 'react';
import { getIncomeTransactions } from './actions';
import { IncomeList } from './income-list';
import {
    PageContainer,
    PageHeader,
    EmptyState,
} from '@/components';
import { PageLoading } from '@/components/page-loading';
import { ErrorBoundary } from '@/components/error-boundary';

async function IncomeContent() {
    const { data: transactions, error } = await getIncomeTransactions();

    if (error) {
        throw new Error(error);
    }

    const hasTransactions = transactions && transactions.length > 0;

    return (
        <>
            {/* Income List */}
            {!hasTransactions ? (
                <EmptyState
                    icon="💰"
                    title="No income logged yet"
                    description="Start tracking your income by logging your first transaction."
                    actionLabel="+ Log Your First Income"
                    actionHref="/dashboard/income/new"
                    examples={[
                        'Classic Full Set - $150',
                        'Volume Fill - $80',
                        'Consultation - $50',
                    ]}
                />
            ) : (
                <IncomeList transactions={transactions} />
            )}
        </>
    );
}

export default function IncomePage() {
    return (
        <PageContainer>
            <PageHeader
                title="Income"
                description="Track your income and earnings"
                actionLabel="+ Log Income"
                actionHref="/dashboard/income/new"
            />
            <ErrorBoundary>
                <Suspense fallback={<PageLoading />}>
                    <IncomeContent />
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
}
