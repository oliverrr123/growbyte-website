import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_LOCALE_COOKIE } from "./lib/site-locale-cookie";

/**
 * Derive locale from path so we can persist the user's language without
 * sending everyone to `/` (Accept-Language) when they return "home".
 */
function localeFromPathname(pathname: string): string | null {
  const top = pathname.match(/^\/(en|cs|sk|de)(?:\/|$)/);
  if (top) return top[1];
  const solutions = pathname.match(/^\/solutions\/(en|cs|sk|de)(?:\/|$)/);
  if (solutions) return solutions[1];
  const caseStudies = pathname.match(
    /^\/case-studies\/(en|cs|sk|de)(?:\/|$)/,
  );
  if (caseStudies) return caseStudies[1];

  if (pathname === "/digipritel" || pathname.startsWith("/digipritel/")) {
    return "cs";
  }
  if (pathname === "/digipriatel" || pathname.startsWith("/digipriatel/")) {
    return "sk";
  }
  if (pathname === "/myfriend" || pathname.startsWith("/myfriend/")) {
    return "en";
  }
  if (pathname === "/digifreund" || pathname.startsWith("/digifreund/")) {
    return "de";
  }
  return null;
}

export function middleware(request: NextRequest) {
  const locale = localeFromPathname(request.nextUrl.pathname);
  if (!locale) return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set(SITE_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|ingest).*)",
  ],
};
