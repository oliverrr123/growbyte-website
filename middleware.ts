import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_LOCALE_COOKIE } from "./lib/site-locale-cookie";
import {
  DIGIPRITEL_ORIGIN,
  MYFRIEND_JP_ORIGIN,
  TRYMYFRIEND_ORIGIN,
} from "./lib/elder-companion-seo";

/**
 * Derive locale from path so we can persist the user's language without
 * sending everyone to `/` (Accept-Language) when they return "home".
 */
function localeFromPathname(pathname: string): string | null {
  const top = pathname.match(/^\/(en|cs|sk|ja)(?:\/|$)/);
  if (top) return top[1];
  const solutions = pathname.match(/^\/solutions\/(en|cs|sk|ja)(?:\/|$)/);
  if (solutions) return solutions[1];
  const caseStudies = pathname.match(
    /^\/case-studies\/(en|cs|sk|ja)(?:\/|$)/,
  );
  if (caseStudies) return caseStudies[1];

  if (pathname === "/digipriatel" || pathname.startsWith("/digipriatel/")) {
    return "sk";
  }
  return null;
}

function responseWithLocale(locale: string, response: NextResponse) {
  response.cookies.set(SITE_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

/** Only Set-Cookie when the value changes, so static pages stay CDN-cacheable. */
function maybePersistLocale(
  request: NextRequest,
  locale: string,
  response: NextResponse,
) {
  const existing = request.cookies.get(SITE_LOCALE_COOKIE)?.value;
  if (existing === locale) return response;
  return responseWithLocale(locale, response);
}

/**
 * MyFriend, DigiPřítel and myfriend.jp now live in the separate
 * myfriend-website project. Old growbyte.co links keep working through
 * permanent redirects to the product domains.
 */
export function productRedirect(pathname: string): { url: string; status: 301 | 308 } | null {
  const to = (origin: string, path: string) => ({ url: `${origin}${path}`, status: 301 as const });

  if (pathname.startsWith("/api/myfriend/")) {
    // 308 keeps the method and body for any API client still using this host.
    return { url: `${TRYMYFRIEND_ORIGIN}${pathname}`, status: 308 };
  }

  if (pathname === "/start" || pathname === "/start/") return to(DIGIPRITEL_ORIGIN, "/start");

  if (pathname === "/digipritel" || pathname.startsWith("/digipritel/")) {
    const rest = pathname.slice("/digipritel".length).replace(/\/$/, "");
    if (rest.startsWith("/events") || rest.startsWith("/udalosti")) return to(DIGIPRITEL_ORIGIN, "/udalosti");
    if (rest.startsWith("/vice")) return to(DIGIPRITEL_ORIGIN, "/vice");
    if (["/podminky", "/soukromi", "/dashboard", "/login"].includes(rest)) return to(DIGIPRITEL_ORIGIN, rest);
    return to(DIGIPRITEL_ORIGIN, "/");
  }

  if (pathname === "/myfriend-jp" || pathname.startsWith("/myfriend-jp/")) {
    const rest = pathname.slice("/myfriend-jp".length).replace(/\/$/, "");
    if (rest.startsWith("/events")) return to(MYFRIEND_JP_ORIGIN, "/events");
    if (rest.startsWith("/more")) return to(MYFRIEND_JP_ORIGIN, "/more");
    return to(MYFRIEND_JP_ORIGIN, "/");
  }

  if (pathname === "/myfriend" || pathname.startsWith("/myfriend/")) {
    const rest = pathname.slice("/myfriend".length).replace(/\/$/, "");
    if (rest === "") return to(TRYMYFRIEND_ORIGIN, "/");
    if (rest.startsWith("/events")) return to(TRYMYFRIEND_ORIGIN, "/events");
    if (rest.startsWith("/more")) return to(TRYMYFRIEND_ORIGIN, "/more");
    if (/^\/(try|verify|dashboard|messages|login|onboarding|call)(\/|$)/.test(rest)) {
      return to(TRYMYFRIEND_ORIGIN, rest);
    }
    // e.g. /myfriend/privacy and /myfriend/terms are served under the same path.
    return to(TRYMYFRIEND_ORIGIN, pathname.replace(/\/$/, ""));
  }

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const product = productRedirect(pathname);
  if (product) {
    const url = new URL(product.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, product.status);
  }

  const locale = localeFromPathname(pathname);
  if (!locale) return NextResponse.next();

  return maybePersistLocale(request, locale, NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Skip Next internals, Vercel internals, and any path with a file extension
     * (assets + common scanner probes like .php / .env).
     */
    "/((?!_next|_vercel|ingest|.*\\..*).*)",
  ],
};
