import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith("/gsg") && path !== "/gsg/login") {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/gsg/login", request.url));
    }
    
    try {
      await decrypt(session);
    } catch (e) {
      return NextResponse.redirect(new URL("/gsg/login", request.url));
    }
  }

  // Prevent logged in users from seeing login page
  if (path === "/gsg/login") {
    const session = request.cookies.get("session")?.value;
    if (session) {
      try {
        await decrypt(session);
        return NextResponse.redirect(new URL("/gsg", request.url));
      } catch (e) {}
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/gsg/:path*"],
};
