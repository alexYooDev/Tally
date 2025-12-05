// ================================================
// Password Reset API Route
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, parseBody, validateRequired } from '@/lib/api-helpers';

/**
 * POST /api/auth/reset-password
 * Request password reset email
 */
export async function POST(request: NextRequest) {
    const { data: body, error: parseError } = await parseBody<{
        email: string;
    }>(request);

    if (parseError || !body) {
        return errorResponse('Invalid request body', 400, parseError || undefined);
    }

    // Validate required fields
    const validation = validateRequired(body, ['email']);
    if (!validation.valid) {
        return errorResponse(
            'Missing required fields',
            400,
            `Required: ${validation.missing?.join(', ')}`
        );
    }

    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        });

        if (error) {
            return errorResponse(error.message, 400);
        }

        return jsonResponse({
            success: true,
            message: 'Check your email for the password reset link!',
        }, 200);
    } catch (error: any) {
        console.error('Password reset error:', error);
        return errorResponse('Failed to send reset email', 500, error.message);
    }
}
