import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const role = (req.nextauth.token as any)?.role;

console.log("ROLE:", role);
    // if (isAdminRoute && role !== "admin") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Only guard admin and checkout — browsing/search stay public.
export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
