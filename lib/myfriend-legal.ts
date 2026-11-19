export const MYFRIEND_LEGAL_VERSION = "2026-09-21";

export function legalAcceptanceMetadata(input: unknown, now = new Date()): Record<string, string> | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  if (value.accepted !== true || value.version !== MYFRIEND_LEGAL_VERSION) return null;
  return {
    terms_version: MYFRIEND_LEGAL_VERSION,
    privacy_version: MYFRIEND_LEGAL_VERSION,
    terms_accepted_at: now.toISOString(),
    terms_acceptance_method: "unchecked_web_checkbox",
  };
}
