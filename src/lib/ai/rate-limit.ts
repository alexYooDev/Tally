// ================================================
// Rate Limiting for AI Insights
// ================================================
// Prevents excessive API calls and costs

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_GENERATIONS_PER_DAY = 10;

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    error?: string;
}

/**
 * Check if user can generate insights (rate limiting)
 * 
 * For production, we store generation count in database
 * For development (mock mode), rate limiting is disabled
 */
export async function checkRateLimit(userId: string, isMockMode: boolean): Promise<RateLimitResult> {
    // Skip rate limiting in mock mode
    if (isMockMode) {
        return {
            allowed: true,
            remaining: 999,
            resetAt: new Date(Date.now() + RATE_LIMIT_WINDOW),
        };
    }

    // For real API calls, check database for generation count
    const supabase = await createClient();

    // Get user's generation history from the last 24 hours
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW);

    const { data, error } = await supabase
        .from('ai_insight_generations')
        .select('id, created_at')
        .eq('user_id', userId)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false }) as {
            data: { id: string; created_at: string }[] | null;
            error: any;
        };

    if (error) {
        console.error('Error checking rate limit:', error);
        // Fail open - allow the request if database check fails
        return {
            allowed: true,
            remaining: MAX_GENERATIONS_PER_DAY,
            resetAt: new Date(Date.now() + RATE_LIMIT_WINDOW),
        };
    }

    const generationCount = data?.length || 0;
    const remaining = Math.max(0, MAX_GENERATIONS_PER_DAY - generationCount);

    // Find the oldest generation to determine reset time
    const oldestGeneration = data && data.length > 0 ? data[data.length - 1] : null;
    const resetAt = oldestGeneration
        ? new Date(new Date(oldestGeneration.created_at).getTime() + RATE_LIMIT_WINDOW)
        : new Date(Date.now() + RATE_LIMIT_WINDOW);

    if (generationCount >= MAX_GENERATIONS_PER_DAY) {
        return {
            allowed: false,
            remaining: 0,
            resetAt,
            error: `Rate limit exceeded. You can generate ${MAX_GENERATIONS_PER_DAY} insights per day. Try again after ${resetAt.toLocaleString()}.`,
        };
    }

    return {
        allowed: true,
        remaining,
        resetAt,
    };
}

/**
 * Record a generation event for rate limiting
 */
export async function recordGeneration(userId: string, isMockMode: boolean): Promise<void> {
    // Don't record in mock mode
    if (isMockMode) {
        return;
    }

    const supabase = await createClient();

    // Type the insert data explicitly
    const insertData: Database['public']['Tables']['ai_insight_generations']['Insert'] = {
        user_id: userId,
    };

    const { error } = await supabase
        .from('ai_insight_generations')
        .insert(insertData);

    if (error) {
        console.error('Error recording generation:', error);
        // Don't throw - this is not critical
    }
}

/**
 * Get rate limit info for display to user
 */
export async function getRateLimitInfo(userId: string, isMockMode: boolean): Promise<{
    used: number;
    limit: number;
    remaining: number;
    resetAt: Date;
}> {
    const result = await checkRateLimit(userId, isMockMode);

    return {
        used: MAX_GENERATIONS_PER_DAY - result.remaining,
        limit: MAX_GENERATIONS_PER_DAY,
        remaining: result.remaining,
        resetAt: result.resetAt,
    };
}
