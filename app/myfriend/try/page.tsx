import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requestHostFromHeaders } from "@/lib/elder-companion-seo";
import { myfriendAppPath } from "@/lib/myfriend";

export default async function TryMyFriend() {
  const host = requestHostFromHeaders(await headers());
  redirect(myfriendAppPath(host, "/") + "#get-myfriend");
}
