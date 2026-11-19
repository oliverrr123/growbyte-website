export function validSetupEmail(value: unknown): value is string {
  return typeof value === "string" && value.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function checkoutEmail(session: { metadata?: Record<string, string> | null; customer_details?: { email?: string | null } | null }) {
  for (const email of [session.metadata?.recovery_email, session.customer_details?.email]) {
    if (validSetupEmail(email)) return email.trim();
  }
  return "";
}
