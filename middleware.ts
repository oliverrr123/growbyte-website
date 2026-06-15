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

function requestHeadersWithLocale(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-site-locale", locale);
  return headers;
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

    if (pathname === "/" || pathname === "/vice") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = pathname === "/" ? "/digipritel" : "/digipritel/vice";
      const response = NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeadersWithLocale(request, "cs") },
      });
      return responseWithLocale("cs", response);
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

    if (pathname === "/myfriend" || pathname === "/myfriend/") {
      return redirectToTryMyFriend(request, "/");
    }

    if (pathname === "/myfriend/more" || pathname === "/myfriend/more/") {
      return redirectToTryMyFriend(request, "/more");
    }

    if (pathname === "/myfriend/try" || pathname === "/myfriend/try/") {
      return redirectToTryMyFriend(request, "/try");
    }

    if (pathname === "/" || pathname === "/more" || pathname === "/try") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname =
        pathname === "/"
          ? "/myfriend"
          : pathname === "/more"
            ? "/myfriend/more"
            : "/myfriend/try";
      const response = NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeadersWithLocale(request, "en") },
      });
      return responseWithLocale("en", response);
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
      pathname === "/myfriend" ||
      pathname === "/myfriend/" ||
      pathname === "/myfriend/more" ||
      pathname === "/myfriend/more/" ||
      pathname === "/myfriend/try" ||
      pathname === "/myfriend/try/")
  ) {
    if (pathname.startsWith("/digipritel/vice")) {
      return redirectToDigipritel(request, "/vice");
    }

    if (pathname.startsWith("/digipritel")) {
      return redirectToDigipritel(request, "/");
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

  const response = NextResponse.next({
    request: { headers: requestHeadersWithLocale(request, locale) },
  });
  return responseWithLocale(locale, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|ingest).*)",
  ],
};
