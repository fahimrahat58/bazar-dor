import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);

    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;

    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    signInUrl.searchParams.set("message", "login-required");

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/profile/:path*", "/update-profile/:path*"],
};
