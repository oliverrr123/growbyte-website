import { NextResponse } from "next/server";
import { ACCOUNT_SESSION_COOKIE, myfriendAppPath, requestOrigin } from "@/lib/myfriend";
import {
  ACCOUNT_SESSION_COOKIE_OPTIONS,
  signAccountSession,
} from "@/lib/myfriend-session";
import { stripeClient } from "@/lib/myfriend-providers";
import { activateFromCheckoutSession } from "@/lib/myfriend-billing";
import { isTryMyFriendHost } from "@/lib/elder-companion-seo";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = requestOrigin(request);
  const dashboard = `${origin}${myfriendAppPath(host, "/messages")}`;
  const home = `${origin}${isTryMyFriendHost(host) ? "/" : "/myfriend"}`;

  if (!sessionId) {
    return NextResponse.redirect(home);
  }

  const stripe = stripeClient();
  if (!stripe) {
    return NextResponse.redirect(dashboard);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status === "complete" && session.payment_status === "paid") {
      const activated = await activateFromCheckoutSession(stripe, session);
      if (!activated.ok) return NextResponse.redirect(dashboard);
      const phone = session.metadata?.phone;
      if (phone) {
        const response = NextResponse.redirect(dashboard);
        response.cookies.set(
          ACCOUNT_SESSION_COOKIE,
          signAccountSession(phone),
          ACCOUNT_SESSION_COOKIE_OPTIONS,
        );
        return response;
      }
    }
  } catch (error) {
    console.error("Checkout complete failed", error);
  }

  return NextResponse.redirect(dashboard);
}
