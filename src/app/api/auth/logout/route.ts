// ================================================
// Logout API Route
// ================================================

import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, withAuth } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/logout
 * Sign out the current user
 */
export async function POST(request: NextRequest) {
    return withAuth(request, async () => {
        try {
            const supabase = await createClient();
            
            const { error } = await supabase.auth.signOut();

            if (error) {
                return errorResponse(error.message, 500);
            }

            return jsonResponse({
                success: true,
                message: 'Logged out successfully',
            }, 200);
        } catch (error: any) {
            console.error('Logout error:', error);
            return errorResponse('Failed to logout', 500, error.message);
        }
    });
}
