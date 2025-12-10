// ================================================
// AI Insights Cache Service
// ================================================
// Handles caching of AI-generated insights in Supabase
// Reduces API costs and improves performance

import { createClient } from '@/lib/supabase/server';
import type { InsightsResponse } from './types';

const CACHE_DURATION_HOURS = 24;

/**
 * Get cached insights if they exist and haven't expired
 * Returns null if cache miss or expired
 */
export async function getCachedInsights(userId: string): Promise<InsightsResponse | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('ai_insights')
        .select('insights, expires_at')
        .eq('user_id', userId)
        .single();
    
    if (error || !data) {
        return null;
    }
    
    // Check if expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
        console.log('📦 Cache expired, deleting...');
        // Expired - delete it
        await deleteCachedInsights(userId);
        return null;
    }
    
    console.log('✅ Cache hit - returning cached insights');
    return data.insights as unknown as InsightsResponse;
}

/**
 * Store insights in cache with 24-hour expiration
 * Uses upsert to replace existing cache
 */
export async function cacheInsights(
    userId: string, 
    insights: InsightsResponse
): Promise<void> {
    const supabase = await createClient();
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + CACHE_DURATION_HOURS);
    
    console.log(`💾 Caching insights (expires at ${expiresAt.toISOString()})`);
    
    // Upsert - replace existing cache
    const { error } = await supabase
        .from('ai_insights')
        .upsert({
            user_id: userId,
            insights: insights as any, // JSONB
            expires_at: expiresAt.toISOString(),
        }, {
            onConflict: 'user_id'
        });
    
    if (error) {
        console.error('Error caching insights:', error);
        // Don't throw - caching failure shouldn't break the flow
    }
}

/**
 * Delete cached insights (for manual regeneration)
 */
export async function deleteCachedInsights(userId: string): Promise<void> {
    const supabase = await createClient();
    
    console.log('🗑️ Deleting cached insights');
    
    const { error } = await supabase
        .from('ai_insights')
        .delete()
        .eq('user_id', userId);
    
    if (error) {
        console.error('Error deleting cached insights:', error);
    }
}

/**
 * Get cache metadata (when it was created, when it expires)
 * Useful for displaying cache status in UI
 */
export async function getCacheMetadata(userId: string): Promise<{
    createdAt: Date;
    expiresAt: Date;
    isExpired: boolean;
} | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('ai_insights')
        .select('created_at, expires_at')
        .eq('user_id', userId)
        .single();
    
    if (error || !data) {
        return null;
    }
    
    const expiresAt = new Date(data.expires_at);
    
    return {
        createdAt: new Date(data.created_at!),
        expiresAt,
        isExpired: expiresAt < new Date(),
    };
}
