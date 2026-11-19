import { MYFRIEND_ACCENT } from "@/lib/myfriend";

export function MyFriendBrand({
  className = "text-[56px] sm:text-[72px]",
  locale = "en",
}: {
  className?: string;
  locale?: "en" | "cs";
}) {
  return (
    <span className={`caveat-bold-font leading-none tracking-tight ${className}`}>
      <span className="text-black">{locale === "cs" ? "digi" : "my"}</span>
      <span style={{ color: MYFRIEND_ACCENT }}>{locale === "cs" ? "přítel" : "friend"}</span>
    </span>
  );
}
