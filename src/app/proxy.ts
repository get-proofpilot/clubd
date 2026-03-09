import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only protect routes that require auth.
  // Feed is public (browse-first pattern).
  // Do NOT protect root /, /feed, /login, or /verify.
  matcher: ["/onboarding/:path*", "/profile/:path*"],
};
