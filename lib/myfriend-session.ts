import { createHmac, timingSafeEqual } from "crypto";

export const ACCOUNT_SESSION_COOKIE = "mf_session";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

function secret() {
  return (
    process.env.MYFRIEND_VERIFY_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    (process.env.NODE_ENV !== "production" ? "dev-myfriend-verify" : "")
  );
}

export function signAccountSession(phone: string) {
  const key = secret();
  if (!key) throw new Error("Missing MYFRIEND_VERIFY_SECRET");
  const exp = Date.now() + SESSION_MS;
  const payload = `${phone}|${exp}`;
  const sig = createHmac("sha256", key).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export function readAccountSession(token: string | undefined) {
  if (!token) return null;
  const key = secret();
  if (!key) return null;
  let raw: string;
  try {
    raw = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const parts = raw.split("|");
  if (parts.length !== 3) return null;
  const [phone, expRaw, sig] = parts;
  if (!phone || !expRaw || !sig) return null;
  const payload = `${phone}|${expRaw}`;
  const expected = createHmac("sha256", key).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Date.now() > Number(expRaw)) return null;
  return { phone };
}

export const ACCOUNT_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
};
