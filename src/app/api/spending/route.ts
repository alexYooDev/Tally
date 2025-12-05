// ================================================
// Spending Transactions API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, parseBody, validateRequired, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/spending
 * Get all spending transactions for the authenticated user
 */
export async function GET(request: NextRequest) {
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
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) {
                return handleSupabaseError(error);
            }

            return jsonResponse({ data }, 200);
        } catch (error: any) {
            console.error('Get spending error:', error);
            return errorResponse('Failed to fetch spending transactions', 500, error.message);
        }
    });
}

/**
 * POST /api/spending
 * Create a new spending transaction
 */
export async function POST(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        const { data: body, error: parseError } = await parseBody<{
            date: string;
            description: string;
            category_id?: string;
            amount: number;
            payment_method: string;
            notes?: string;
        }>(request);

        if (parseError || !body) {
            return errorResponse('Invalid request body', 400, parseError || undefined);
        }

        // Validate required fields
        const validation = validateRequired(body, [
            'date',
            'description',
            'amount',
            'payment_method'
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
                .from('spending')
                .insert({
                    user_id: userId,
                    date: body.date,
                    description: body.description,
                    category_id: body.category_id || null,
                    amount: body.amount,
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
                message: 'Spending transaction created successfully',
                data 
            }, 201);
        } catch (error: any) {
            console.error('Create spending error:', error);
            return errorResponse('Failed to create spending transaction', 500, error.message);
        }
    });
}
