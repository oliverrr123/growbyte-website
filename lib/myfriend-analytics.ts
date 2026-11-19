export const ANALYTICS_VERSION = "loved-one-v4";
export const ANALYTICS_EVENTS = {
  screen: "myfriend_onboarding_step_viewed",
  checkout: "myfriend_checkout_started",
  checkoutError: "myfriend_checkout_failed",
  paid: "myfriend_payment_completed",
  complete: "myfriend_onboarding_completed",
} as const;

// Only anonymous SDK UUIDs are accepted; never carry email/phone identifiers.
export function anonymousAnalyticsId(value: unknown): string | undefined {
  return typeof value === "string" && /^(?:\$device:)?[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) ? value : undefined;
}

export function analyticsEnvironment(host: string | null) {
  return /^(www\.)?trymyfriend\.com$/i.test(host || "") ? "production" : "test";
}

export function checkoutAnalyticsMetadata(input: unknown, host: string | null): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const data = input as Record<string, unknown>;
  const distinctId = anonymousAnalyticsId(data.distinct_id);
  if (!distinctId) return {};
  return {
    analytics_distinct_id: distinctId,
    analytics_version: ANALYTICS_VERSION,
    analytics_environment: analyticsEnvironment(host),
  };
}
