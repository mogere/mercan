import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  const protectedRoutes = ["/dashboard", "/checkout", "/cart"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && (!isAuthenticated || userRole !== "admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/cart/:path*",
    "/admin/:path*",
  ],
};
