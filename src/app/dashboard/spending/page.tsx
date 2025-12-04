import { getSpendingTransactions, getSpendingCategories } from './actions';
import { SpendingList } from './spending-list';
import {
    PageContainer,
    PageHeader,
    ErrorAlert,
    EmptyState,
} from '@/components';

export default async function SpendingPage() {
    const { data: transactions, error } = await getSpendingTransactions();
    const { data: categories } = await getSpendingCategories();

    if (error) {
        return (
            <PageContainer>
                <ErrorAlert>Error loading spending transactions: {error}</ErrorAlert>
            </PageContainer>
        );
    }

    const hasTransactions = transactions && transactions.length > 0;

    return (
        <PageContainer>
            <PageHeader
                title="Spending"
                description="Track your expenses and spending"
                actionLabel="+ Log Spending"
                actionHref="/dashboard/spending/new"
            />

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
        </PageContainer>
    );
}
