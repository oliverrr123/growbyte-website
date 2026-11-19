"use client";

import { getPostHogClient, currentPostHogClient } from "./posthog-client";
import { ANALYTICS_EVENTS, ANALYTICS_VERSION, analyticsEnvironment, anonymousAnalyticsId } from "./myfriend-analytics";

type Event = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
type Details = { step_id?: string; phase?: "questions" | "setup"; billing_plan?: "monthly" | "annual" };

export function captureOnboarding(event: Event, details: Details) {
  if (typeof window === "undefined") return;
  const environment = analyticsEnvironment(window.location.hostname);
  // Capture asynchronously; analytics must never block a form or navigation.
  void getPostHogClient().then(client => {
    if (!client || client.has_opted_out_capturing()) return;
    client.capture(event, {
      ...details,
      flow_version: ANALYTICS_VERSION,
      analytics_environment: environment,
    }, { transport: "sendBeacon" });
  }).catch(() => {});
}

export function checkoutAnalyticsContext() {
  const client = currentPostHogClient();
  if (!client || client.has_opted_out_capturing()) return undefined;
  const distinct_id = anonymousAnalyticsId(client.get_distinct_id());
  return distinct_id ? { distinct_id } : undefined;
}
