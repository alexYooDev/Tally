// ================================================
// AI Insights Types - Shared type definitions
// ================================================

export type InsightType = 'alert' | 'trend' | 'recommendation';

export type InsightPriority = 'low' | 'medium' | 'high';

export interface Insight {
    id: string;
    type: InsightType;
    title: string;
    description: string;
    priority: InsightPriority;
    icon?: string;
    actionable?: boolean;
    actionSteps?: string[]; // Detailed step-by-step guidelines
    metadata?: Record<string, any>;
}

export interface InsightsResponse {
    alerts: Insight[];
    trends: Insight[];
    recommendations: Insight[];
    generatedAt: string;
    dataRange: string;
}

export interface TransactionStats {
    totalIncome: number;
    totalSpending: number;
    netCashFlow: number;
    transactionCount: number;
    avgTransactionAmount: number;
    topSpendingCategories: Array<{ category: string; amount: number; percentage: number }>;
    topIncomeServices: Array<{ service: string; amount: number; count: number }>;
    timeRange: string;
}
