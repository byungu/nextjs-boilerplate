import { NextRequest, NextResponse } from "next/server";

/**
 * 개별 API 키를 활용한 인증 절차
 * middle ware
 * @param request
 */
export function middleware(request: NextRequest) {
    const protectedPaths = ['/api/supabase', '/api/elasticsearch', '/api/files'];

    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    if (isProtectedPath) {
        const apiKey = request.nextUrl.searchParams.get('apiKey');

        const validApiKey = process.env.API_KEY;
        if(!apiKey || apiKey !== validApiKey) {
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or missing api key.' },
                { status: 500 }
            );
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/supabase/:path*',
        '/api/elasticsearch/:path*',
        '/api/files/:path*'
    ]
};

