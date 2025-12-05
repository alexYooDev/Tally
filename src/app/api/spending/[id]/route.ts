// ================================================
// Spending Transaction by ID API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/spending/[id]
 * Get a single spending transaction by ID
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
                .from('spending')
                .select(`
                    *,
                    category:categories (
                        id,
                        name
                    )
                `)
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return errorResponse('Spending transaction not found', 404);
                }
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get spending error:', error);
            return errorResponse('Failed to fetch spending transaction', 500, error.message);
        }
    });
}

/**
 * PUT /api/spending/[id]
 * Update a spending transaction
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            date?: string;
            description?: string;
            category_id?: string;
            amount?: number;
            payment_method?: string;
            notes?: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        try {
            const supabase = await createClient();

            // First verify the spending transaction exists and belongs to the user
            const { data: existing, error: fetchError } = await supabase
                .from('spending')
                .select('id')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (fetchError || !existing) {
                return errorResponse('Spending transaction not found', 404);
            }

            // Update the spending transaction
            const { data, error } = await supabase
                .from('spending')
                .update({
                    ...(body.date && { date: body.date }),
                    ...(body.description && { description: body.description }),
                    ...(body.category_id !== undefined && { category_id: body.category_id || null }),
                    ...(body.amount !== undefined && { amount: body.amount }),
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
                message: 'Spending transaction updated successfully',
                data
            }, 200);
        } catch (error: any) {
            console.error('Update spending error:', error);
            return errorResponse('Failed to update spending transaction', 500, error.message);
        }
    });
}

/**
 * DELETE /api/spending/[id]
 * Delete a spending transaction
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
                .from('spending')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({
                success: true,
                message: 'Spending transaction deleted successfully'
            }, 200);
        } catch (error: any) {
            console.error('Delete spending error:', error);
            return errorResponse('Failed to delete spending transaction', 500, error.message);
        }
    });
}
