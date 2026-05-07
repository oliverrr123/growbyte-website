"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { SK_MAX_UTM_SOURCE } from "@/app/solutions/sk-max-contacts";
import { appendSkSolutionsCaseStudiesUtm } from "@/lib/sk-max-append-solutions-utm";
import { readStoredSkMaxCampaign, writeStoredSkMaxCampaign } from "@/lib/sk-max-campaign-storage";

type SkMaxCampaignContextValue = {
  active: boolean;
  augmentHref: (href: string) => string;
};

const defaultValue: SkMaxCampaignContextValue = {
  active: false,
  augmentHref: (h) => h,
};

const SkMaxCampaignContext = createContext<SkMaxCampaignContextValue>(defaultValue);

function isSkSolutionsPath(pathname: string): boolean {
  return pathname.startsWith("/solutions/sk") || pathname.startsWith("/case-studies/sk");
}
function SkMaxCampaignProviderInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const pathOk = isSkSolutionsPath(pathname ?? "");
    const utmOk = searchParams.get("utm_source")?.toLowerCase() === SK_MAX_UTM_SOURCE;
    if (utmOk && pathOk) {
      writeStoredSkMaxCampaign();
      setActive(true);
      return;
    }
    setActive(readStoredSkMaxCampaign());
  }, [pathname, searchParams]);

  const augmentHref = useCallback(
    (href: string) => appendSkSolutionsCaseStudiesUtm(href, active),
    [active],
  );

  const ctx = useMemo(() => ({ active, augmentHref }), [active, augmentHref]);

  return <SkMaxCampaignContext.Provider value={ctx}>{children}</SkMaxCampaignContext.Provider>;
}

/**
 * Tracks `?utm_source=max` on Slovak solutions/case-study URLs, persists cookie + localStorage,
 * and exposes augmented internal links plus `active` for contact UI.
 */
export function SkMaxCampaignProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<SkMaxCampaignContext.Provider value={defaultValue}>{children}</SkMaxCampaignContext.Provider>}>
      <SkMaxCampaignProviderInner>{children}</SkMaxCampaignProviderInner>
    </Suspense>
  );
}

export function useSkMaxCampaign(): SkMaxCampaignContextValue {
  return useContext(SkMaxCampaignContext);
}
