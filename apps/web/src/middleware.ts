import { NextResponse, type NextRequest } from "next/server";

import { auth0 } from "@/libs/auth0";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request); // authentication routes — let the middleware handle it
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }
  const session = await auth0.getSession(request);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      // user is not authenticated, redirect to login page
      return NextResponse.redirect(
        `http://${request.nextUrl.host}/auth/login?returnTo=/`
      );
    }
    // user is authenticated, check if they are an admin
    // why specify http? - https://github.com/vercel/next.js/issues/67036
    const res = await fetch(`http://${request.nextUrl.host}/api/check_admin`, {
      headers: { userId: session.user.sub },
    });
    const data = await res.json();
    if (!data.isAdmin) {
      // user is not an admin, redirect to landing page
      return NextResponse.redirect(`http://${request.nextUrl.host}/`);
    }
    // user is an admin, allow access to the page
    return NextResponse.next();
  }
  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
