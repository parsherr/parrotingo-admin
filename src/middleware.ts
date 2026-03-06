import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get("admin_auth");
    const isAuthenticated = authCookie?.value === "authenticated";

    if (request.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (request.nextUrl.pathname === "/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
};
