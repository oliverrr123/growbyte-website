"use client";

import Link from "next/link";
import { useLandingLocale } from "@/components/myfriend-landing-locale";
import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactNode } from "react";

export function MyFriendTryButton({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLandingLocale();
  const onboarding = locale === "cs" ? "/start" : pathname.startsWith("/myfriend") ? "/myfriend/call" : "/call";
  const isAbsolute = style?.left != null || style?.top != null;

  return (
    <Link
      href={onboarding}
      className={`inline-flex cursor-pointer items-center justify-center font-medium text-white origin-center transition-[scale,transform,filter,box-shadow] duration-500 ease-out hover:scale-[1.03] hover:brightness-[1.04] hover:shadow-[0_10px_28px_rgba(255,136,4,0.22)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none ${className}`}
      style={{
        backgroundColor: "rgba(255, 136, 4, 0.9)",
        ...(isAbsolute ? { position: "absolute" } : {}),
        ...style,
      }}
    >
      {children ?? (locale === "cs" ? "Vyzkoušet" : "Try MyFriend")}
    </Link>
  );
}
