import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware runs on every request
 * - Refreshes auth sessions
 * - Protects routes that require authentication
 * - Handles auth redirects
 */

export default async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options
                    })
                },
            },
        }
    );

    /* Refresh session if expired */
    const { data: { user } } = await supabase.auth.getUser();
    
    /* const protected routes => require authentication */
    const protectedRoutes = ['/dashboard', '/income', '/spending', '/services'];
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    /* Redirect to dashboard if accessing auth pages while logged in */
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    if (isAuthPath && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}

/** 
 * Configure which routes to run middleware on
*/

export const confige = {
    /**
     * Match all request paths except:
     * _next/static (static files)
     * _next/image (image optimization files)
     * - favicon.ico
     * - public files (public folder)
     */
    matcher: [
       '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}