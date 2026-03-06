import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authCookie = request.cookies.get("admin_auth");
    const isAuthenticated = authCookie?.value === "authenticated";

    // Handle root path
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from login page
    if (pathname === "/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
