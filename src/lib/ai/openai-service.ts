// ================================================
// Real AI Insights Service - OpenAI Integration
// ================================================
// Production service using OpenAI API with rate limiting

import OpenAI from 'openai';
import type { CashFlowTransaction } from '@/app/dashboard/actions';
import type { InsightsResponse, TransactionStats } from './types';
import { analyzeTransactions } from './mock-service';

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        console.warn('OpenAI API key not configured');
        return null;
    }

    return new OpenAI({
        apiKey,
    });
}

/**
 * Generate financial insights using OpenAI GPT-4
 */
export async function generateRealInsights(
    transactions: CashFlowTransaction[]
): Promise<InsightsResponse> {
    const client = getOpenAIClient();

    if (!client) {
        throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }

    // Analyze transactions to get stats
    const stats = analyzeTransactions(transactions);

    // Create prompt with aggregated data
    const prompt = createInsightsPrompt(stats);

    try {
        const completion = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', // Default to cheaper model
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content;
        
        if (!responseText) {
            throw new Error('No response from OpenAI');
        }

        const insights = JSON.parse(responseText) as InsightsResponse;

        // Add metadata
        return {
            ...insights,
            generatedAt: new Date().toISOString(),
            dataRange: stats.timeRange,
        };
    } catch (error) {
        console.error('Error generating insights from OpenAI:', error);
        throw new Error('Failed to generate insights. Please try again.');
    }
}

/**
 * System prompt for OpenAI
 */
const SYSTEM_PROMPT = `You are a financial advisor for small business owners. 
Your role is to analyze transaction data and provide actionable insights.

You must respond with a JSON object containing three arrays:
- alerts: Critical issues requiring immediate attention (high priority)
- trends: Observed patterns and positive developments (informational)
- recommendations: Actionable suggestions for improvement (medium priority)

Each insight should have:
- id: unique identifier (string)
- type: "alert", "trend", or "recommendation"
- title: short, clear title (max 60 chars)
- description: detailed explanation (max 200 chars)
- priority: "low", "medium", or "high"
- icon: relevant emoji
- actionable: boolean, whether user can take action
- actionSteps: array of 3-5 specific, detailed step-by-step actions the user should take (required for all insights)

Keep insights specific, data-driven, and actionable. Avoid generic advice.
Action steps should be concrete, practical, and immediately implementable.`;

/**
 * Create the user prompt with transaction stats
 */
function createInsightsPrompt(stats: TransactionStats): string {
    return `Analyze the following business financial data and provide insights:

**Summary:**
- Total Income: $${stats.totalIncome.toFixed(2)}
- Total Spending: $${stats.totalSpending.toFixed(2)}
- Net Cash Flow: $${stats.netCashFlow.toFixed(2)}
- Transaction Count: ${stats.transactionCount}
- Average Transaction: $${stats.avgTransactionAmount.toFixed(2)}

**Top Spending Categories:**
${stats.topSpendingCategories.map((c, i) => 
    `${i + 1}. ${c.category}: $${c.amount.toFixed(2)} (${c.percentage.toFixed(1)}%)`
).join('\n')}

**Top Income Services:**
${stats.topIncomeServices.map((s, i) => 
    `${i + 1}. ${s.service}: $${s.amount.toFixed(2)} (${s.count} transactions)`
).join('\n')}

**Time Range:** ${stats.timeRange}

Provide 2-3 alerts (if critical issues exist), 2-3 trends, and 3-4 recommendations.
Respond ONLY with valid JSON matching the specified schema.`;
}
