import { createHmac, timingSafeEqual } from "crypto";
import type { MyFriendAudience } from "@/lib/myfriend";
import { isMyFriendAudience } from "@/lib/myfriend";

function secret() {
  return (
    process.env.MYFRIEND_VERIFY_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.TWILIO_AUTH_TOKEN ||
    (process.env.NODE_ENV !== "production" ? "dev-myfriend-verify" : "")
  );
}

export function signVerifiedPhone(phone: string, audience: MyFriendAudience) {
  const key = secret();
  if (!key) throw new Error("Missing MYFRIEND_VERIFY_SECRET");
  const exp = Date.now() + 30 * 60 * 1000;
  const payload = `${phone}|${audience}|${exp}`;
  const sig = createHmac("sha256", key).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export function readVerifiedPhone(token: string | undefined) {
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
  if (parts.length !== 4) return null;
  const [phone, audience, expRaw, sig] = parts;
  if (!phone || !isMyFriendAudience(audience) || !expRaw || !sig) return null;
  const payload = `${phone}|${audience}|${expRaw}`;
  const expected = createHmac("sha256", key).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Date.now() > Number(expRaw)) return null;
  return { phone, audience };
}
