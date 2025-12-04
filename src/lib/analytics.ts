// ================================================                              
// Analytics Data Aggregation Utilities                                          
// ================================================ 

import { CashFlowTransaction } from "@/app/dashboard/actions";

export type TimeRange = '7d' | '30d' | '90d' | 'all';

export type DailyData = {
    date: string;
    income: number;
    spending: number;
    net: number;
};

export type CategoryData = {
    name: string;
    value: number;
    percentage: number;
};

export type PaymentMethodData = {
    name: string;
    value: number;
    percentage: number;
};

export type MonthlyData = {
    month: string;
    income: number;
    spending: number;
    net: number;
};

/* Filter transactions by time range */
export function filterByTimeRange(
        transactions: CashFlowTransaction[],
        timeRange: TimeRange
    ): CashFlowTransaction[] {
    
    if (timeRange === 'all') return transactions;

    const now = new Date();

    /* slice off 'd' from day ranges */
    const days = parseInt(timeRange.split('d')[0]);

    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return transactions.filter((t) => new Date(t.date) >= cutoffDate);
}

/* Aggregate transactions by day for time series chart */
export function aggregateByDay(transactions: CashFlowTransaction[]): DailyData[] {
    const dailyMap = new Map<string, DailyData>();

    transactions.forEach((t) => {
        const date = t.date.split('T')[0]; // Get YYYY-MM-DD
        const existing = dailyMap.get(date) || { date, income: 0, spending: 0, net: 0 };

        if (t.type === 'income') {
            existing.income += t.amount;
        } else {
            existing.spending += t.amount;
        }
        existing.net = existing.income - existing.spending;
        
        dailyMap.set(date, existing);
    });

    return Array.from(dailyMap.values()).sort((a,b) => a.date.localeCompare(b.date));
}

/* Aggregate transactions by month for monthly comparison */
export function aggregateByMonth(transactions: CashFlowTransaction[]): MonthlyData[] {
    const monthlyMap = new Map<string, MonthlyData>();
    
    transactions.forEach((t) => {
        const date = new Date(t.date);
        const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

        const existing = monthlyMap.get(month) || { month, income: 0, spending: 0, net: 0 };

        if (t.type === 'income') {
            existing.income += t.amount;
        } else {
            existing.spending += t.amount;
        }
        existing.net = existing.income - existing.spending;

        monthlyMap.set(month, existing);
    });

    // Sort by date (convert back to compare)
    return Array.from(monthlyMap.values()).sort((a,b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
    });
}

/* Aggregate spending by category for pie chart */
export function aggregateByCategory(transactions: CashFlowTransaction[]): CategoryData[] {
    const categoryMap = new Map<string, number>();
    let total = 0;

    // Only process spending transactions with categories
    transactions
        .filter((t) => t.type === 'spending' && t.category)
        .forEach((t) => {
            const category = t.category!;
            categoryMap.set(category, (categoryMap.get(category) || 0) + t.amount);
            total += t.amount;
        });
    // convert to array with percentages
    return Array.from(categoryMap.entries())
        .map(([name, value]) => ({
            name,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0,
        }))
        .sort((a,b) => b.value - a.value); // Sort by value descending
}

/* Aggregate transactions by payment method */
export function aggregateByPaymentMethod(transactions: CashFlowTransaction[]): PaymentMethodData[] {
    const paymentMap = new Map<string, number>();
    let total = 0;
    
    transactions.forEach((t) => {
        const method = t.payment_method.replace('_', ' ');
        paymentMap.set(method, (paymentMap.get(method) || 0) + t.amount);
        total += t.amount;
    });

    // Convert to array with percentages
    return Array.from(paymentMap.entries())
        .map(([name, value]) => ({
            name,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value); // Sort by value descending
}

/* Get summary statistics */
export function getSummaryStats(transactions: CashFlowTransaction[]) {
    const income = transactions.filter((t) => t.type === 'income');
    const spending = transactions.filter((t) => t.type === 'spending');

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalSpending = spending.reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = totalIncome - totalSpending;

    const avgIncome = income.length > 0 ? totalIncome / income.length : 0;
    const avgSpending = spending.length > 0 ? totalSpending / spending.length: 0;

    return {
        totalIncome,
        totalSpending,
        netCashFlow,
        avgIncome,
        avgSpending,
        incomeCount: income.length,
        spendingCount: spending.length,
    };
}