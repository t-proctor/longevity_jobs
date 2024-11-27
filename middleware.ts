import { type NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Create a response object that we'll modify
  let response = NextResponse.next();

  try {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          detectSessionInUrl: false,
        }
      }
    );

    // Get the auth cookie
    const authCookie = request.cookies.get('sb-token')?.value;

    if (authCookie) {
      // Set the auth cookie in the response
      response.cookies.set('sb-token', authCookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      });

      // Set the auth header for Supabase
      supabase.auth.setSession({
        access_token: authCookie,
        refresh_token: '',
      });
    }

    return response;
  } catch (e) {
    // If anything goes wrong, just continue without authentication
    console.error('Auth middleware error:', e);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};