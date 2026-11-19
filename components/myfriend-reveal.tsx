"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Keep closing content mounted until its height transition finishes. */
export function MyFriendReveal({ open, children }: { open: boolean; children: ReactNode }) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) { setMounted(true); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setMounted(false), reduced ? 0 : 280);
    return () => clearTimeout(timer);
  }, [open]);

  return <div className="myfriend-reveal" data-expanded={open} aria-hidden={!open} inert={!open}>
    <div className="myfriend-reveal-inner">{open || mounted ? children : null}</div>
  </div>;
}
