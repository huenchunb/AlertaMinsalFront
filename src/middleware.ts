import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userCookie = req.cookies.get(".AspNetCore.Identity.Application")?.value;

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (!userCookie && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (userCookie && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
