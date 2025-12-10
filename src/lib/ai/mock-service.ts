// ================================================
// Mock AI Insights Service - For Development
// ================================================
// This service provides realistic fake insights without API costs
// Perfect for UI development and testing

import type { CashFlowTransaction } from '@/app/dashboard/actions';
import type { InsightsResponse, TransactionStats, Insight } from './types';

/**
 * Analyze transactions and generate mock statistics
 */
export function analyzeTransactions(transactions: CashFlowTransaction[]): TransactionStats {
    const income = transactions.filter(t => t.type === 'income');
    const spending = transactions.filter(t => t.type === 'spending');

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalSpending = spending.reduce((sum, t) => sum + t.amount, 0);

    // Top spending categories
    const spendingByCategory = spending.reduce((acc, t) => {
        const cat = t.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const topSpendingCategories = Object.entries(spendingByCategory)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: (amount / totalSpending) * 100,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    // Top income services
    const incomeByService = income.reduce((acc, t) => {
        const service = t.description;
        if (!acc[service]) {
            acc[service] = { amount: 0, count: 0 };
        }
        acc[service].amount += t.amount;
        acc[service].count += 1;
        return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const topIncomeServices = Object.entries(incomeByService)
        .map(([service, data]) => ({
            service,
            amount: data.amount,
            count: data.count,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    return {
        totalIncome,
        totalSpending,
        netCashFlow: totalIncome - totalSpending,
        transactionCount: transactions.length,
        avgTransactionAmount: transactions.length > 0 
            ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
            : 0,
        topSpendingCategories,
        topIncomeServices,
        timeRange: 'Last 30 days',
    };
}

/**
 * Generate mock insights based on transaction data
 */
export async function generateMockInsights(
    transactions: CashFlowTransaction[]
): Promise<InsightsResponse> {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const stats = analyzeTransactions(transactions);

    const alerts: Insight[] = [];
    const trends: Insight[] = [];
    const recommendations: Insight[] = [];

    // Generate alerts based on data
    if (stats.netCashFlow < 0) {
        alerts.push({
            id: 'alert-1',
            type: 'alert',
            title: 'Negative Cash Flow Detected',
            description: `Your spending (${formatCurrency(stats.totalSpending)}) exceeded income (${formatCurrency(stats.totalIncome)}) by ${formatCurrency(Math.abs(stats.netCashFlow))} this period.`,
            priority: 'high',
            icon: '🚨',
            actionable: true,
        });
    }

    if (stats.topSpendingCategories.length > 0 && stats.topSpendingCategories[0].percentage > 40) {
        alerts.push({
            id: 'alert-2',
            type: 'alert',
            title: `High Concentration in ${stats.topSpendingCategories[0].category}`,
            description: `${stats.topSpendingCategories[0].percentage.toFixed(1)}% of your spending is in one category. Consider diversifying expenses.`,
            priority: 'medium',
            icon: '⚠️',
        });
    }

    // Generate trends
    if (stats.totalIncome > stats.totalSpending) {
        trends.push({
            id: 'trend-1',
            type: 'trend',
            title: 'Positive Cash Flow Trend',
            description: `You're generating ${formatCurrency(stats.netCashFlow)} in positive cash flow. Keep up the great work!`,
            priority: 'low',
            icon: '📈',
        });
    }

    if (stats.topIncomeServices.length > 0) {
        const topService = stats.topIncomeServices[0];
        trends.push({
            id: 'trend-2',
            type: 'trend',
            title: `${topService.service} is Your Top Revenue Source`,
            description: `Generated ${formatCurrency(topService.amount)} across ${topService.count} transactions.`,
            priority: 'low',
            icon: '💰',
        });
    }

    if (stats.transactionCount > 50) {
        trends.push({
            id: 'trend-3',
            type: 'trend',
            title: 'High Business Activity',
            description: `${stats.transactionCount} transactions recorded. Your business is thriving!`,
            priority: 'low',
            icon: '🚀',
        });
    }

    // Generate recommendations
    if (stats.avgTransactionAmount < 100) {
        recommendations.push({
            id: 'rec-1',
            type: 'recommendation',
            title: 'Consider Bundling Services',
            description: `Average transaction: ${formatCurrency(stats.avgTransactionAmount)}. Bundling services could increase per-transaction revenue.`,
            priority: 'medium',
            icon: '💡',
            actionable: true,
        });
    }

    if (stats.topSpendingCategories.some(c => c.category.toLowerCase().includes('supplies'))) {
        recommendations.push({
            id: 'rec-2',
            type: 'recommendation',
            title: 'Bulk Purchasing Opportunity',
            description: 'Supplies are a significant expense. Consider bulk purchasing for better rates.',
            priority: 'low',
            icon: '🛒',
        });
    }

    recommendations.push({
        id: 'rec-3',
        type: 'recommendation',
        title: 'Track Payment Method Preferences',
        description: 'Understanding client payment preferences can help optimize your checkout process.',
        priority: 'low',
        icon: '💳',
    });

    return {
        alerts,
        trends,
        recommendations,
        generatedAt: new Date().toISOString(),
        dataRange: stats.timeRange,
    };
}

/**
 * Helper function to format currency
 */
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}
