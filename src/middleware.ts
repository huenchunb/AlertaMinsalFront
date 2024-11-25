import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value;

    if (req.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", req.url));
    } else if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    } else if (token && req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*"],
};
