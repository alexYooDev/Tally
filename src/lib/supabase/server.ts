// ================================================
// TALLY - Supabase Server Client
// ================================================
// For Server Components, Server Actions, and API Routes

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

/**
 * Creates a Supabase client for Server Components
 * Handles cookie-based auth in server-side contexts
 * 
 * @returns Supabase client instance for server use
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * import { createClient } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const supabase = createClient();
 *   const { data } = await supabase.from('services').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {                
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({name, value, ...options});
                    } catch (error) {
                        console.error('Error setting cookie:', error);
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        console.error('Error removing cookie:', error);
                    }
                },
            },
        }
    );
}