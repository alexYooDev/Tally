// ================================================
// Login API Route
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, parseBody, validateRequired } from '@/lib/api-helpers';

/**
 * POST /api/auth/login
 * Authenticate user and return access token
 */
export async function POST(request: NextRequest) {
    const { data: body, error: parseError } = await parseBody<{
        email: string;
        password: string;
    }>(request);

    if (parseError || !body) {
        return errorResponse('Invalid request body', 400, parseError || undefined);
    }

    // Validate required fields
    const validation = validateRequired(body, ['email', 'password']);
    if (!validation.valid) {
        return errorResponse(
            'Missing required fields',
            400,
            `Required: ${validation.missing?.join(', ')}`
        );
    }

    try {
        const supabase = await createClient();

        // Sign in user
        const { data, error } = await supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password,
        });

        if (error) {
            return errorResponse(error.message || 'Invalid email or password', 401);
        }

        if (!data.session) {
            return errorResponse('Failed to create session', 500);
        }

        // Return success with tokens
        return jsonResponse({
            success: true,
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
                expires_in: data.session.expires_in,
            },
        }, 200);
    } catch (error: any) {
        console.error('Login error:', error);
        return errorResponse('Failed to login', 500, error.message);
    }
}
