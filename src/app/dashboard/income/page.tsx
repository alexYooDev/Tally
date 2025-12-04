import { getIncomeTransactions } from './actions';
import { IncomeList } from './income-list';
import {
    PageContainer,
    PageHeader,
    ErrorAlert,
    EmptyState,
} from '@/components';

export default async function IncomePage() {
    const { data: transactions, error } = await getIncomeTransactions();

    if (error) {
        return (
            <PageContainer>
                <ErrorAlert>Error loading income transactions: {error}</ErrorAlert>
            </PageContainer>
        );
    }

    const hasTransactions = transactions && transactions.length > 0;

    return (
        <PageContainer>
            <PageHeader
                title="Income"
                description="Track your income and earnings"
                actionLabel="+ Log Income"
                actionHref="/dashboard/income/new"
            />

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
        </PageContainer>
    );
}
