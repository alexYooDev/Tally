import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

/**
 * Creates a Supabase client for browser/client components
 * This client automatically handles auth state and cookies
 * 
 * @returns Supabase client instance
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { createClient } from '@/lib/supabase/client';
 * 
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase client...
 * }
 * ```
 */

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}