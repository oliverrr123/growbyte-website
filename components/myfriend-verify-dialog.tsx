"use client";

import { useState, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { MyFriendVerifyForm } from "@/components/myfriend-verify-form";

export function MyFriendVerifyDialog({
  children,
  defaultOpen = false,
}: {
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? (
        <Dialog.Trigger className="group flex w-full max-w-[512px] cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-inherit">
          {children}
        </Dialog.Trigger>
      ) : null}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 pt-10 shadow-xl outline-none transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
          <Dialog.Close
            className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} />
          </Dialog.Close>
          <h2 className="m-0 text-[28px] font-medium tracking-tight text-black">
            I have a verification code
          </h2>
          <p className="mt-3 m-0 text-[17px] leading-snug text-black/55">
            Enter the 6-digit code MyFriend just told you on the call. Then you&apos;ll pay $25/month.
          </p>
          <div className="mt-6">
            <MyFriendVerifyForm />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
