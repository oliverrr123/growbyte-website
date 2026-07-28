"use client";

import { useEffect } from "react";

/**
 * Patches <html lang> at runtime for accessibility/screen readers when the
 * user navigates into a localized case-studies route. SEO uses the
 * `hreflang` alternates set in metadata, which Google ranks above this.
 */
export function LangAttribute({ locale }: { locale: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  return null;
}
