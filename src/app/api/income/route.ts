// ================================================
// Income Transactions API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, validateRequired, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/income
 * Get all income transactions for the authenticated user
 */
export async function GET(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        try {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('income')
                .select(`
                    *,
                    service:services (
                        id,
                        name,
                        category:categories (
                            id,
                            name
                        )
                    )
                `)
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get income error:', error);
            return errorResponse('Failed to fetch income transactions', 500, error.message);
        }
    });
}

/**
 * POST /api/income
 * Create a new income transaction
 */
export async function POST(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            date: string;
            service_id?: string;
            client_name?: string;
            session_count: number;
            rate_per_session: number;
            total_received: number;
            payment_method: string;
            notes?: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        // Validate required fields
        const validation = validateRequired(body, [
            'date',
            'session_count',
            'rate_per_session',
            'total_received',
            'payment_method'
        ]);
        
        if (!validation.valid) {
            return errorResponse(
                'Missing required fields',
                400,
                `Required: ${validation.missing?.join(', ')}`
            );
        }

        // Validate that either service_id or client_name is provided
        if (!body.service_id && !body.client_name) {
            return errorResponse(
                'Either service_id or client_name must be provided',
                400
            );
        }

        try {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('income')
                .insert({
                    user_id: userId,
                    date: body.date,
                    service_id: body.service_id || null,
                    client_name: body.client_name || null,
                    session_count: body.session_count,
                    rate_per_session: body.rate_per_session,
                    total_received: body.total_received,
                    payment_method: body.payment_method,
                    notes: body.notes || null,
                })
                .select()
                .single();

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({ 
                success: true,
                message: 'Income transaction created successfully',
                data 
            }, 201);
        } catch (error: any) {
            console.error('Create income error:', error);
            return errorResponse('Failed to create income transaction', 500, error.message);
        }
    });
}
