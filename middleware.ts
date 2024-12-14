import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Redireciona usuários não logados tentando acessar rotas protegidas
  if (!token && (pathname.startsWith("/authenticated") || pathname === "/user")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Permite apenas usuários ADMIN na rota "/admin"
  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authenticated/:path*", "/admin/:path*", "/user"], // Rotas protegidas
};
