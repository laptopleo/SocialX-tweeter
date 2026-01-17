// proxy.ts - Next.js 16
import { NextResponse } from "next/server";

// NextAuth v5 en Next.js 16 ya adjunta auth al request automáticamente
export default function proxy(request: Request) {
  // Type assertion para acceder a auth (NextAuth lo adjunta)
  const req = request as Request & { 
    nextUrl: URL; 
    auth: any;
  };
  
  const { pathname } = new URL(request.url);
  const isLoggedIn = !!req.auth; // ← auth ya está disponible en el request

  // Rutas públicas
  const publicPaths = new Set(["/", "/search"]);
  const profileRegex = /^\/[A-Za-z0-9._-]+$/;
  const postRegex = /^\/[A-Za-z0-9._-]+\/post\/\d+$/;

  const isPublic = publicPaths.has(pathname) || 
                   profileRegex.test(pathname) || 
                   postRegex.test(pathname);

  if (isPublic) return NextResponse.next();

  if (!isLoggedIn) {
    const url = new URL("/", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};