// ================================================
// API Helper Utilities
// ================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Standard API error response format
 */
export type ApiError = {
    error: string;
    details?: string;
    code?: string;
};

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse<T>(data: T, status: number = 200): NextResponse {
    return NextResponse.json(data, { 
        status,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

/**
 * Create error response with consistent format
 */
export function errorResponse(
    message: string, 
    status: number = 500,
    details?: string
): NextResponse {
    const error: ApiError = {
        error: message,
        ...(details && { details }),
    };
    return jsonResponse(error, status);
}

/**
 * Authenticate request using Supabase JWT
 * Returns the authenticated user or null if authentication fails
 */
export async function authenticateRequest(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const supabase = await createClient();
        
        // Set the auth token for this request
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return { user: null, error: 'Invalid or expired token' };
        }

        return { user, error: null };
    } catch (error) {
        return { user: null, error: 'Authentication failed' };
    }
}

/**
 * Middleware wrapper for authenticated routes
 */
export async function withAuth(
    request: NextRequest,
    handler: (request: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return errorResponse(error || 'Unauthorized', 401);
    }

    return handler(request, user.id);
}

/**
 * Parse JSON body from request with error handling
 */
export async function parseBody<T>(request: NextRequest): Promise<{ data: T | null; error: string | null }> {
    try {
        const data = await request.json() as T;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: 'Invalid JSON body' };
    }
}

/**
 * Validate required fields in request body
 */
export function validateRequired(
    body: Record<string, any>,
    requiredFields: string[]
): { valid: boolean; missing?: string[] } {
    const missing = requiredFields.filter(field => !body[field]);
    
    if (missing.length > 0) {
        return { valid: false, missing };
    }
    
    return { valid: true };
}

/**
 * Handle Supabase errors and convert to API responses
 */
export function handleSupabaseError(error: any): NextResponse {
    console.error('Supabase error:', error);
    
    // Map common Supabase errors to appropriate HTTP status codes
    if (error.code === '23505') {
        return errorResponse('Resource already exists', 409);
    }
    
    if (error.code === '23503') {
        return errorResponse('Referenced resource not found', 404);
    }
    
    if (error.code === 'PGRST116') {
        return errorResponse('Resource not found', 404);
    }
    
    return errorResponse(error.message || 'Database operation failed', 500);
}
