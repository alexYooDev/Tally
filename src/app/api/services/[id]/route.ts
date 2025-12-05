// ================================================
// Service by ID API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/services/[id]
 * Get a single service by ID
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
                .from('services')
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
                    return errorResponse('Service not found', 404);
                }
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get service error:', error);
            return errorResponse('Failed to fetch service', 500, error.message);
        }
    });
}

/**
 * PUT /api/services/[id]
 * Update a service
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            name?: string;
            category_id?: string;
            default_price?: number;
            description?: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        try {
            const supabase = await createClient();

            // First verify the service exists and belongs to the user
            const { data: existing, error: fetchError } = await supabase
                .from('services')
                .select('id')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (fetchError || !existing) {
                return errorResponse('Service not found', 404);
            }

            // Update the service
            const { data, error } = await supabase
                .from('services')
                .update({
                    ...(body.name && { name: body.name }),
                    ...(body.category_id && { category_id: body.category_id }),
                    ...(body.default_price !== undefined && { default_price: body.default_price }),
                    ...(body.description !== undefined && { description: body.description || null }),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({
                success: true,
                message: 'Service updated successfully',
                data
            }, 200);
        } catch (error: any) {
            console.error('Update service error:', error);
            return errorResponse('Failed to update service', 500, error.message);
        }
    });
}

/**
 * DELETE /api/services/[id]
 * Delete a service
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
                .from('services')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({
                success: true,
                message: 'Service deleted successfully'
            }, 200);
        } catch (error: any) {
            console.error('Delete service error:', error);
            return errorResponse('Failed to delete service', 500, error.message);
        }
    });
}
