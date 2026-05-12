import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    const callbackUrl = req.nextUrl.pathname;
    const signInUrl = new URL(
      `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      req.url
    );
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
