import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/admin/dashboard/:path*",
        "/auth/sign-in",
        "/auth/sign-up",
        "/",
        "/verify/:path*",
    ],
}

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_AUTH_SECRET,
    })
    const url = request.nextUrl

    if (
        token &&
        (url.pathname.startsWith("/auth/sign-in") ||
            url.pathname.startsWith("/auth/sign-up") ||
            url.pathname.startsWith("/verify") ||
            url.pathname === "/")
    ) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }

    if (!token && url.pathname.startsWith("/admin/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    return NextResponse.next()
}
