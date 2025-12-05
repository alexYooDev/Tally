// ================================================
// Services API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, validateRequired, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/services
 * Get all services for the authenticated user
 */
export async function GET(request: NextRequest) {
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
                .eq('user_id', userId)
                .order('name', { ascending: true });

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get services error:', error);
            return errorResponse('Failed to fetch services', 500, error.message);
        }
    });
}

/**
 * POST /api/services
 * Create a new service
 */
export async function POST(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            name: string;
            category_id: string;
            default_price: number;
            description?: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        // Validate required fields
        const validation = validateRequired(body, [
            'name',
            'category_id',
            'default_price'
        ]);
        
        if (!validation.valid) {
            return errorResponse(
                'Missing required fields',
                400,
                `Required: ${validation.missing?.join(', ')}`
            );
        }

        try {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('services')
                .insert({
                    user_id: userId,
                    name: body.name,
                    category_id: body.category_id,
                    default_price: body.default_price,
                    description: body.description || null,
                })
                .select()
                .single();

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({ 
                success: true,
                message: 'Service created successfully',
                data 
            }, 201);
        } catch (error: any) {
            console.error('Create service error:', error);
            return errorResponse('Failed to create service', 500, error.message);
        }
    });
}
