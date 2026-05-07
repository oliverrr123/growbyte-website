/**
 * Persist Slovak “max” UTM campaign (client-only callers).
 */

export const SK_MAX_STORAGE_KEY = "growbyte_sk_utm_source_max";

export const SK_MAX_COOKIE_NAME = "growbyte_sk_utm_source_max";

/** 90 days */
const SK_MAX_MAX_AGE_SEC = 60 * 60 * 24 * 90;

export function readStoredSkMaxCampaign(): boolean {
  if (typeof document === "undefined") return false;
  const hasCookie = document.cookie.split(";").some((c) => {
    const t = c.trim();
    return t.startsWith(`${SK_MAX_COOKIE_NAME}=`);
  });
  if (hasCookie) return true;
  try {
    return window.localStorage.getItem(SK_MAX_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeStoredSkMaxCampaign(): void {
  if (typeof document === "undefined") return;
  try {
    window.localStorage.setItem(SK_MAX_STORAGE_KEY, "1");
  } catch {
    /* ignore quota / privacy mode */
  }
  document.cookie = `${SK_MAX_COOKIE_NAME}=1;path=/;max-age=${SK_MAX_MAX_AGE_SEC};SameSite=Lax`;
}
