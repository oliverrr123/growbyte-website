import { cookies } from "next/headers";
import { requestOrigin } from "./myfriend";
import { myfriendApi, type MyFriendAccount } from "./myfriend-api";
import { ACCOUNT_SESSION_COOKIE, ACCOUNT_SESSION_COOKIE_OPTIONS, readAccountSession } from "./myfriend-session";

export const EMAIL_ACCESS_COOKIE = "mf_email_access";
export const EMAIL_REFRESH_COOKIE = "mf_email_refresh";
export type EmailTokens = { access_token: string; refresh_token: string; expires_in: number };
export async function saveEmailSession(tokens: EmailTokens) {
  const jar = await cookies();
  jar.set(EMAIL_ACCESS_COOKIE, tokens.access_token, { ...ACCOUNT_SESSION_COOKIE_OPTIONS, maxAge: tokens.expires_in });
  jar.set(EMAIL_REFRESH_COOKIE, tokens.refresh_token, ACCOUNT_SESSION_COOKIE_OPTIONS);
  jar.delete(ACCOUNT_SESSION_COOKIE);
}
// Called only inside Route Handlers, where refreshed cookies can be persisted.
export async function dashboardAccount() {
  const jar = await cookies();
  const access_token = jar.get(EMAIL_ACCESS_COOKIE)?.value;
  const refresh_token = jar.get(EMAIL_REFRESH_COOKIE)?.value;
  if (access_token || refresh_token) {
    const result = await myfriendApi<{ account: MyFriendAccount; session?: EmailTokens }>("/api/email-login/session", { method: "POST", body: { access_token, refresh_token } });
    if (!result.ok) return null;
    if (result.data.session) await saveEmailSession(result.data.session);
    return result.data.account;
  }
  // Preserve access for customers who just completed phone verification.
  const session = readAccountSession(jar.get(ACCOUNT_SESSION_COOKIE)?.value);
  if (!session) return null;
  const result = await myfriendApi<MyFriendAccount>("/api/account", { query: { phone: session.phone } });
  return result.ok ? result.data : null;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Next's internal URL can use 0.0.0.0 while the browser uses localhost.
  return !origin || origin === new URL(requestOrigin(request)).origin;
}
