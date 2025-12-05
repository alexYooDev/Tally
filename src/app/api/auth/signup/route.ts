// ================================================
// Authentication API Routes
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, parseBody, validateRequired } from '@/lib/api-helpers';

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function POST(request: NextRequest) {
    const { data: body, error: parseError } = await parseBody<{
        email: string;
        password: string;
        confirmPassword: string;
    }>(request);

    if (parseError || !body) {
        return errorResponse('Invalid request body', 400, parseError || undefined);
    }

    // Validate required fields
    const validation = validateRequired(body, ['email', 'password', 'confirmPassword']);
    if (!validation.valid) {
        return errorResponse(
            'Missing required fields',
            400,
            `Required: ${validation.missing?.join(', ')}`
        );
    }

    // Validate password match
    if (body.password !== body.confirmPassword) {
        return errorResponse('Passwords do not match', 400);
    }

    // Validate password length
    if (body.password.length < 6) {
        return errorResponse('Password must be at least 6 characters long', 400);
    }

    try {
        const supabase = await createClient();

        // Create user
        const { data, error } = await supabase.auth.signUp({
            email: body.email,
            password: body.password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            },
        });

        if (error) {
            return errorResponse(error.message, 400);
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
            return jsonResponse({
                success: true,
                message: 'Check your email to confirm your account!',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                },
            }, 201);
        }

        // Return success with session
        return jsonResponse({
            success: true,
            message: 'Account created successfully',
            user: {
                id: data.user?.id,
                email: data.user?.email,
            },
            session: data.session ? {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
            } : null,
        }, 201);
    } catch (error: any) {
        console.error('Signup error:', error);
        return errorResponse('Failed to create account', 500, error.message);
    }
}
