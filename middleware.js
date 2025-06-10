import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("user_token")?.value; // Correct way to get cookies in middleware
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname !== "/login" && pathname !== "/signup") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes except Next.js static files
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // Matches all pages except Next.js assets
};
