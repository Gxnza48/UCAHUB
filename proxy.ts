import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api (API routes — must bypass to avoid auth timeouts blocking them)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, svg, png, jpg, jpeg, gif, webp (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
