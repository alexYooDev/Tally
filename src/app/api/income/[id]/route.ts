// ================================================
// Income Transaction by ID API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/income/[id]
 * Get a single income transaction by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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
                        default_price,
                        category:categories (
                            id,
                            name
                        )
                    )
                `)
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return errorResponse('Income transaction not found', 404);
                }
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get income error:', error);
            return errorResponse('Failed to fetch income transaction', 500, error.message);
        }
    });
}

/**
 * PUT /api/income/[id]
 * Update an income transaction
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            date?: string;
            service_id?: string;
            client_name?: string;
            session_count?: number;
            rate_per_session?: number;
            total_received?: number;
            payment_method?: string;
            notes?: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        try {
            const supabase = await createClient();

            // First verify the income transaction exists and belongs to the user
            const { data: existing, error: fetchError } = await supabase
                .from('income')
                .select('id')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (fetchError || !existing) {
                return errorResponse('Income transaction not found', 404);
            }

            // Update the income transaction
            const {data, error } = await supabase
                .from('income')
                .update({
                    ...(body.date && { date: body.date }),
                    ...(body.service_id !== undefined && { service_id: body.service_id || null }),
                    ...(body.client_name !== undefined && { client_name: body.client_name || null }),
                    ...(body.session_count !== undefined && { session_count: body.session_count }),
                    ...(body.rate_per_session !== undefined && { rate_per_session: body.rate_per_session }),
                    ...(body.total_received !== undefined && { total_received: body.total_received }),
                    ...(body.payment_method && { payment_method: body.payment_method }),
                    ...(body.notes !== undefined && { notes: body.notes || null }),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({
                success: true,
                message: 'Income transaction updated successfully',
                data
            }, 200);
        } catch (error: any) {
            console.error('Update income error:', error);
            return errorResponse('Failed to update income transaction', 500, error.message);
        }
    });
}

/**
 * DELETE /api/income/[id]
 * Delete an income transaction
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return withAuth(request, async (_, userId) => {
        try {
            const supabase = await createClient();

            const { error } = await supabase
                .from('income')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({
                success: true,
                message: 'Income transaction deleted successfully'
            }, 200);
        } catch (error: any) {
            console.error('Delete income error:', error);
            return errorResponse('Failed to delete income transaction', 500, error.message);
        }
    });
}
