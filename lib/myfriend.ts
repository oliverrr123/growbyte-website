import { parsePhoneNumberFromString } from "libphonenumber-js";
import { isTryMyFriendHost } from "@/lib/elder-companion-seo";

export const MYFRIEND_ACCENT = "#ff8804";
export const MYFRIEND_CTA = "rgba(255, 136, 4, 0.9)";
export const MYFRIEND_MONTHLY_CENTS = 2500;

export const MYFRIEND_PHONES = {
  us: { display: "+1 949 676 7670", href: "tel:+19496767670", e164: "+19496767670" },
  eu: { display: "+420 910 920 500", href: "tel:+420910920500", e164: "+420910920500" },
} as const;

export type MyFriendAudience = "loved-one" | "myself";

export const VERIFIED_COOKIE = "mf_verified";
export const ACCOUNT_SESSION_COOKIE = "mf_session";

export type MyFriendAppPath = "/verify" | "/dashboard" | "/messages" | "/login" | "/onboarding";

export function myfriendAppPath(host: string | null, path: MyFriendAppPath | "/") {
  if (path === "/") return isTryMyFriendHost(host) ? "/" : "/myfriend";
  return isTryMyFriendHost(host) ? path : `/myfriend${path}`;
}

export function clientMyFriendAppPath(path: MyFriendAppPath | "/") {
  // Navigation runs in the browser; use the public domain's unprefixed routes.
  // Keep the shared home link stable during hydration (middleware serves both).
  if (path !== "/" && typeof window !== "undefined") {
    return myfriendAppPath(window.location.hostname, path);
  }
  if (path === "/") return "/myfriend";
  return `/myfriend${path}`;
}

export function isMyFriendAudience(value: unknown): value is MyFriendAudience {
  return value === "loved-one" || value === "myself";
}

export function normalizeMobile(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const candidates = [
    parsePhoneNumberFromString(trimmed),
    parsePhoneNumberFromString(trimmed, "US"),
    parsePhoneNumberFromString(trimmed, "CZ"),
  ];
  return candidates.find(parsed => parsed?.isValid())?.number ?? null;
}

export function myfriendLineFor(phone: string) {
  return phone.startsWith("+1") ? MYFRIEND_PHONES.us : MYFRIEND_PHONES.eu;
}

export function requestOrigin(request: Request) {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host.split(",")[0]!.trim()}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function checkoutReturnPaths(request: Request) {
  const origin = requestOrigin(request);
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const onTryHost = isTryMyFriendHost(host);
  const complete = onTryHost
    ? "/api/myfriend/checkout/complete"
    : "/api/myfriend/checkout/complete";
  const cancelBase = onTryHost ? "/try" : "/myfriend/try";
  return {
    origin,
    successUrl: `${origin}${complete}?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}${cancelBase}/cancel`,
  };
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
