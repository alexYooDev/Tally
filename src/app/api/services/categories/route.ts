// ================================================
// Service Categories API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, validateRequired, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/services/categories
 * Get all service categories for the authenticated user
 */
export async function GET(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        try {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('categories')
                .select('id, name')
                .eq('user_id', userId)
                .eq('type', 'service')
                .order('name', { ascending: true });

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get service categories error:', error);
            return errorResponse('Failed to fetch service categories', 500, error.message);
        }
    });
}

/**
 * POST /api/services/categories
 * Create or get a service category by name
 */
export async function POST(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            name: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        // Validate required fields
        const validation = validateRequired(body, ['name']);
        if (!validation.valid) {
            return errorResponse(
                'Missing required fields',
                400,
                `Required: ${validation.missing?.join(', ')}`
            );
        }

        try {
            const supabase = await createClient();

            // Check if category already exists
            const { data: existing, error: fetchError } = await supabase
                .from('categories')
                .select('id, name')
                .eq('user_id', userId)
                .eq('type', 'service')
                .ilike('name', body.name)
                .single();

            // If exists, return it
            if (existing && !fetchError) {
                return jsonResponse({
                    success: true,
                    message: 'Category already exists',
                    data: existing
                }, 200);
            }

            // Create new category
            const { data, error } = await supabase
                .from('categories')
                .insert({
                    user_id: userId,
                    name: body.name,
                    type: 'service',
                })
                .select('id, name')
                .single();

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({
                success: true,
                message: 'Category created successfully',
                data
            }, 201);
        } catch (error: any) {
            console.error('Create service category error:', error);
            return errorResponse('Failed to create service category', 500, error.message);
        }
    });
}
