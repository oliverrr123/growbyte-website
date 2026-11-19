import { cookies } from "next/headers";
import { signVerifiedPhone } from "@/lib/myfriend-auth";
import { jsonError, VERIFIED_COOKIE } from "@/lib/myfriend";
import { apiErrorResponse, myfriendApi, myfriendApiConfigured } from "@/lib/myfriend-api";

export async function POST(request: Request) {
  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Enter the 6-digit code from the call.");
  }

  const code = (body.code ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) {
    return jsonError("Enter the 6-digit code.");
  }

  if (!myfriendApiConfigured()) {
    return jsonError("Phone verification isn't set up yet.", 503);
  }

  const result = await myfriendApi<{ phone: string; buyer_name?: string | null }>(
    "/api/verifyCallCode",
    { method: "POST", body: { code } },
  );
  if (!result.ok) return apiErrorResponse(result);

  const token = signVerifiedPhone(result.data.phone, "loved-one");
  const jar = await cookies();
  jar.set(VERIFIED_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60,
    path: "/",
  });

  return Response.json({
    ok: true,
    phone: result.data.phone,
    buyer_name: result.data.buyer_name ?? null,
  });
}
