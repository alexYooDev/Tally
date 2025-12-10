// ================================================
// AI Insights Service - Main Entry Point
// ================================================
// Switches between mock and real service based on environment

import type { CashFlowTransaction } from '@/app/dashboard/actions';
import type { InsightsResponse } from './types';
import { generateMockInsights } from './mock-service';
import { generateRealInsights } from './openai-service';

/**
 * Main function to generate financial insights
 * 
 * Uses mock service by default for development (free)
 * Set USE_REAL_AI=true in environment to use OpenAI API
 */
export async function generateFinancialInsights(
    transactions: CashFlowTransaction[]
): Promise<InsightsResponse> {
    const useRealAI = process.env.USE_REAL_AI === 'true';

    if (useRealAI) {
        console.log('🤖 Generating insights with OpenAI...');
        return generateRealInsights(transactions);
    } else {
        console.log('🎭 Generating mock insights (development mode)...');
        return generateMockInsights(transactions);
    }
}

/**
 * Check if we're in mock mode
 */
export function isMockMode(): boolean {
    return process.env.USE_REAL_AI !== 'true';
}
