import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_LOCALE_COOKIE } from "./lib/site-locale-cookie";
import {
  DIGIPRITEL_ORIGIN,
  GROWBYTE_ORIGIN,
  TRYMYFRIEND_ORIGIN,
  isDigipritelComHost,
  isDigipritelHost,
  isGrowbyteHost,
  isTryMyFriendHost,
  requestHostFromHeaders,
} from "./lib/elder-companion-seo";

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

function redirectToDigipritel(request: NextRequest, pathname: string) {
  const url = new URL(pathname, DIGIPRITEL_ORIGIN);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 301);
}

function redirectToGrowbyte(request: NextRequest, pathname: string) {
  const url = new URL(pathname, GROWBYTE_ORIGIN);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 301);
}

function redirectToTryMyFriend(request: NextRequest, pathname: string) {
  const url = new URL(pathname, TRYMYFRIEND_ORIGIN);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 301);
}

function isDigipritelPublicPath(pathname: string): boolean {
  return (
    pathname === "/llms.txt" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/fonts/")
  );
}

export function middleware(request: NextRequest) {
  const host = requestHostFromHeaders(request.headers);
  const { pathname } = request.nextUrl;

  if (host === "www.digipritel.cz") {
    return redirectToDigipritel(request, pathname);
  }

  if (isDigipritelComHost(host)) {
    return redirectToDigipritel(request, pathname);
  }

  if (isDigipritelHost(host)) {
    if (pathname === "/index.html" || pathname === "/index.html/") {
      return redirectToDigipritel(request, "/");
    }

    if (pathname === "/digipritel" || pathname === "/digipritel/") {
      return redirectToDigipritel(request, "/");
    }

    if (
      pathname === "/digipritel/vice" ||
      pathname === "/digipritel/vice/"
    ) {
      return redirectToDigipritel(request, "/vice");
    }

    if (
      pathname === "/digipritel/events" ||
      pathname === "/digipritel/events/" ||
      pathname === "/digipritel/udalosti" ||
      pathname === "/digipritel/udalosti/"
    ) {
      return redirectToDigipritel(request, "/udalosti");
    }

    if (pathname === "/" || pathname === "/vice" || pathname === "/udalosti") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname =
        pathname === "/"
          ? "/digipritel"
          : pathname === "/vice"
            ? "/digipritel/vice"
            : "/digipritel/events";
      const response = NextResponse.rewrite(rewriteUrl);
      return maybePersistLocale(request, "cs", response);
    }

    if (!isDigipritelPublicPath(pathname)) {
      return redirectToGrowbyte(request, pathname);
    }
  }

  if (host === "www.trymyfriend.com") {
    return redirectToTryMyFriend(request, pathname);
  }

  if (isTryMyFriendHost(host)) {
    if (pathname === "/index.html" || pathname === "/index.html/") {
      return redirectToTryMyFriend(request, "/");
    }

    if (
      pathname === "/" ||
      pathname === "/more" ||
      pathname === "/try" ||
      pathname === "/events"
    ) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname =
        pathname === "/"
          ? "/myfriend"
          : pathname === "/more"
            ? "/myfriend/more"
            : pathname === "/try"
              ? "/myfriend/try"
              : "/myfriend/events";
      const response = NextResponse.rewrite(rewriteUrl);
      return maybePersistLocale(request, "en", response);
    }

    if (!isDigipritelPublicPath(pathname)) {
      return redirectToGrowbyte(request, pathname);
    }
  }

  if (
    isGrowbyteHost(host) &&
    (pathname === "/digipritel" ||
      pathname === "/digipritel/" ||
      pathname === "/digipritel/vice" ||
      pathname === "/digipritel/vice/" ||
      pathname === "/digipritel/events" ||
      pathname === "/digipritel/events/" ||
      pathname === "/digipritel/udalosti" ||
      pathname === "/digipritel/udalosti/" ||
      pathname === "/myfriend" ||
      pathname === "/myfriend/" ||
      pathname === "/myfriend/more" ||
      pathname === "/myfriend/more/" ||
      pathname === "/myfriend/try" ||
      pathname === "/myfriend/try/" ||
      pathname === "/myfriend/events" ||
      pathname === "/myfriend/events/")
  ) {
    if (pathname.startsWith("/digipritel/events") || pathname.startsWith("/digipritel/udalosti")) {
      return redirectToDigipritel(request, "/udalosti");
    }

    if (pathname.startsWith("/digipritel/vice")) {
      return redirectToDigipritel(request, "/vice");
    }

    if (pathname.startsWith("/digipritel")) {
      return redirectToDigipritel(request, "/");
    }

    if (pathname.startsWith("/myfriend/events")) {
      return redirectToTryMyFriend(request, "/events");
    }

    if (pathname.startsWith("/myfriend/more")) {
      return redirectToTryMyFriend(request, "/more");
    }

    if (pathname.startsWith("/myfriend/try")) {
      return redirectToTryMyFriend(request, "/try");
    }

    return redirectToTryMyFriend(request, "/");
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
