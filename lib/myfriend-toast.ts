"use client";

import { toast } from "sonner";

export function myfriendToast(message: string) {
  return toast(message, {
    id: "myfriend-dashboard",
    className: "myfriend-settings-toast",
    style: {
      background: "#fff",
      color: "#292219",
      border: "none",
      borderRadius: "24px",
      padding: "20px 24px",
      fontFamily: "inherit",
      fontSize: "16px",
      fontWeight: 400,
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    },
  });
}
