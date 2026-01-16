// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config"; // <--- USA CONFIG, NO EL OBJETO AUTH COMPLETO
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Rutas públicas
  const publicPaths = new Set(["/", "/search"]);
  const profileRegex = /^\/[A-Za-z0-9._-]+$/;
  const postRegex = /^\/[A-Za-z0-9._-]+\/post\/\d+$/;

  const isPublic = publicPaths.has(pathname) || 
                   profileRegex.test(pathname) || 
                   postRegex.test(pathname);

  if (isPublic) return NextResponse.next();

  if (!isLoggedIn) {
    const url = new URL("/", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};