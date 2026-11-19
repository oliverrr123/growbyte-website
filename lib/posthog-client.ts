import type { PostHog } from "posthog-js";

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | undefined;

export function getPostHogClient() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (typeof window === "undefined" || !key) return Promise.resolve(null);
  // Share initialization with instrumentation-client and captures during hydration.
  return loading ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "always",
    });
    client = posthog;
    return posthog;
  }).catch(() => null);
}

export function currentPostHogClient() { return client; }
