// ================================================
// AI Insights Actions - Server Actions
// ================================================
'use server';

import { createClient } from '@/lib/supabase/server';
import { getCashFlowTransactions } from '@/app/dashboard/actions';
import { generateFinancialInsights, isMockMode } from '@/lib/ai/ai-insights';
import { checkRateLimit, recordGeneration, getRateLimitInfo } from '@/lib/ai/rate-limit';
import { getCachedInsights, cacheInsights, deleteCachedInsights, getCacheMetadata } from '@/lib/ai/insight-cache';
import type { InsightsResponse } from '@/lib/ai/types';

/**
 * Generate AI-powered financial insights
 * 
 * This is the main server action called from the insights page
 * Includes rate limiting for production use
 */
export async function generateInsights(forceRegenerate: boolean = false): Promise<{
    data?: InsightsResponse;
    error?: string;
    rateLimitInfo?: {
        used: number;
        limit: number;
        remaining: number;
    };
    cached?: boolean;
    cacheMetadata?: {
        createdAt: string;
        expiresAt: string;
    };
}> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'Not authenticated' };
        }

        const mockMode = isMockMode();

        // Check cache first (unless force regenerate)
        if (!forceRegenerate) {
            const cachedInsights = await getCachedInsights(user.id);
            if (cachedInsights) {
                console.log('Returning cached insights');
                const metadata = await getCacheMetadata(user.id);
                const rateLimitInfo = await getRateLimitInfo(user.id, mockMode);
                
                return {
                    data: cachedInsights,
                    cached: true,
                    cacheMetadata: metadata ? {
                        createdAt: metadata.createdAt.toISOString(),
                        expiresAt: metadata.expiresAt.toISOString(),
                    } : undefined,
                    rateLimitInfo: {
                        used: rateLimitInfo.used,
                        limit: rateLimitInfo.limit,
                        remaining: rateLimitInfo.remaining,
                    },
                };
            }
        } else {
            // Force regenerate - delete old cache
            console.log('Force regenerate - deleting cache');
            await deleteCachedInsights(user.id);
        }

        // Check rate limit
        const rateLimitCheck = await checkRateLimit(user.id, mockMode);

        if (!rateLimitCheck.allowed) {
            return {
                error: rateLimitCheck.error || 'Rate limit exceeded',
                rateLimitInfo: {
                    used: 10,
                    limit: 10,
                    remaining: 0,
                },
            };
        }

        // Fetch transactions
        const { data: transactions, error: txError } = await getCashFlowTransactions();

        if (txError || !transactions) {
            return { error: txError || 'Failed to fetch transactions' };
        }

        if (transactions.length === 0) {
            return { error: 'No transactions found. Add some income or spending data first.' };
        }

        // Generate insights
        console.log('Generating fresh insights...');
        const insights = await generateFinancialInsights(transactions);

        // Cache the new insights
        await cacheInsights(user.id, insights);

        // Record generation event for rate limiting
        await recordGeneration(user.id, mockMode);

        // Get updated rate limit info
        const rateLimitInfo = await getRateLimitInfo(user.id, mockMode);

        const metadata = await getCacheMetadata(user.id);
        
        return {
            data: insights,
            cached: false,
            cacheMetadata: metadata ? {
                createdAt: metadata.createdAt.toISOString(),
                expiresAt: metadata.expiresAt.toISOString(),
            } : undefined,
            rateLimitInfo: {
                used: rateLimitInfo.used,
                limit: rateLimitInfo.limit,
                remaining: rateLimitInfo.remaining,
            },
        };
    } catch (error) {
        console.error('Error generating insights:', error);
        return {
            error: error instanceof Error ? error.message : 'Failed to generate insights',
        };
    }
}

/**
 * Get current rate limit status without generating insights
 */
export async function getRateLimitStatus(): Promise<{
    data?: {
        used: number;
        limit: number;
        remaining: number;
        resetAt: string;
        isMockMode: boolean;
    };
    error?: string;
}> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'Not authenticated' };
        }

        const mockMode = isMockMode();
        const info = await getRateLimitInfo(user.id, mockMode);

        return {
            data: {
                used: info.used,
                limit: info.limit,
                remaining: info.remaining,
                resetAt: info.resetAt.toISOString(),
                isMockMode: mockMode,
            },
        };
    } catch (error) {
        console.error('Error getting rate limit status:', error);
        return { error: 'Failed to get rate limit status' };
    }
}
