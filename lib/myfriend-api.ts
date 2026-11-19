import { jsonError } from "@/lib/myfriend";

function apiBase() {
  return (process.env.MYFRIEND_API_URL || "").replace(/\/$/, "");
}

function apiKey() {
  return process.env.MYFRIEND_API_KEY || "";
}

export function myfriendApiConfigured() {
  return Boolean(apiBase() && apiKey());
}

export type MyFriendAccount = {
  buyer_phone_number: string;
  senior_phone_number: string | null;
  using_own_number: boolean;
  email: string | null;
  status: string;
  current_period_end: string | null;
  senior_first_name: string | null;
  relationship?: string | null;
  stripe_customer_id: string | null;
  seat_limit?: number;
  members?: Array<{ phone_number: string; first_name: string | null; active: boolean }>;
};

export async function myfriendApi<T>(
  path: string,
  init: { method?: string; body?: unknown; query?: Record<string, string> } = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  const base = apiBase();
  const key = apiKey();
  if (!base || !key) {
    return { ok: false, status: 503, error: "MyFriend API isn't configured." };
  }

  const url = new URL(`${base}${path}`);
  if (init.query) {
    for (const [name, value] of Object.entries(init.query)) {
      url.searchParams.set(name, value);
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return { ok: false, status: 503, error: "MyFriend is temporarily unavailable. Please try again shortly." };
  }

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: data.error || "MyFriend API request failed.",
    };
  }
  return { ok: true, data };
}

export function apiErrorResponse(
  result: { ok: false; status: number; error: string },
) {
  return jsonError(result.error, result.status);
}
