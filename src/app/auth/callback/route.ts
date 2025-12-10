// ================================================
// OAuth Callback Route Handler
// ================================================
// Handles the OAuth redirect from Supabase after user authenticates

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('OAuth callback error:', error);
            // Redirect to login with error
            return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
        }
    }

    // Successful authentication - redirect to dashboard
    return NextResponse.redirect(`${origin}/dashboard`);
}
