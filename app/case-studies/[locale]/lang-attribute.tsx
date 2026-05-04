"use client";

import { useEffect } from "react";
import type { Locale } from "../data";

/**
 * Patches <html lang> at runtime for accessibility/screen readers when the
 * user navigates into a localized case-studies route. SEO uses the
 * `hreflang` alternates set in metadata, which Google ranks above this.
 */
export function LangAttribute({ locale }: { locale: Locale }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  return null;
}
