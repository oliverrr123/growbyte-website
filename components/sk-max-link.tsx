"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useSkMaxCampaign } from "@/components/sk-max-campaign-context";

type Props = ComponentProps<typeof Link>;

/** Same as `next/link` but appends `?utm_source=max` for stored SK campaign URLs. */
export function SkMaxLink({ href, ...rest }: Props) {
  const { augmentHref } = useSkMaxCampaign();
  const nextHref = typeof href === "string" ? augmentHref(href) : href;
  return <Link href={nextHref} {...rest} />;
}
