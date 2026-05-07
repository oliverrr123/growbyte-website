"use client";

import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { EnvelopeOpenIcon, PhoneCallIcon, WhatsappLogoIcon } from "@phosphor-icons/react";

import { useSkMaxCampaign } from "@/components/sk-max-campaign-context";
import { SK_MAX_CONTACTS } from "@/app/solutions/sk-max-contacts";

const EMAIL = "oliver.cingl@gmail.com";
const PHONE_TEXT = "+420 776 781 248";
const WHATSAPP_COPY = "+420 776 781 248";

export function CaseStudyContactCopyButtons() {
  const pathname = usePathname();
  const { active } = useSkMaxCampaign();

  const onSkCampaignPage =
    pathname != null &&
    (pathname.startsWith("/solutions/sk") || pathname.startsWith("/case-studies/sk"));

  const useMaxRow = onSkCampaignPage && active;

  async function handleCopy(text: string, kind: "Email" | "Phone" | "WhatsApp") {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${kind} copied to clipboard`);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  if (useMaxRow) {
    return (
      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 my-6">
        {SK_MAX_CONTACTS.emails.map((email) => (
          <button
            key={email}
            type="button"
            onClick={() => handleCopy(email, "Email")}
            className="w-full md:w-auto border border-border bg-background px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-foreground/10 transition-colors"
          >
            <EnvelopeOpenIcon className="text-muted-foreground shrink-0" size={20} />
            <span className="text-sm text-foreground break-all">{email}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleCopy(SK_MAX_CONTACTS.phoneTel, "WhatsApp")}
          className="border border-border bg-background px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-foreground/10 transition-colors"
        >
          <WhatsappLogoIcon className="shrink-0" size={20} />
          <span className="text-sm text-foreground">{SK_MAX_CONTACTS.phoneLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => handleCopy(SK_MAX_CONTACTS.phoneLabel, "Phone")}
          className="border border-border bg-background px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-foreground/10 transition-colors"
        >
          <PhoneCallIcon className="shrink-0" size={20} />
          <span className="text-sm text-foreground">{SK_MAX_CONTACTS.phoneLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 my-6">
      <button
        type="button"
        onClick={() => handleCopy(EMAIL, "Email")}
        className="w-full md:w-auto border border-border bg-background px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-foreground/10 transition-colors"
      >
        <EnvelopeOpenIcon className="text-muted-foreground shrink-0" size={20} />
        <span className="text-sm text-foreground">{EMAIL}</span>
      </button>
      <button
        type="button"
        onClick={() => handleCopy(WHATSAPP_COPY, "WhatsApp")}
        className="border border-border bg-background px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-foreground/10 transition-colors"
      >
        <WhatsappLogoIcon className="shrink-0" size={20} />
        <span className="text-sm text-foreground">{PHONE_TEXT}</span>
      </button>
      <button
        type="button"
        onClick={() => handleCopy(PHONE_TEXT, "Phone")}
        className="border border-border bg-background px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-foreground/10 transition-colors"
      >
        <PhoneCallIcon className="shrink-0" size={20} />
        <span className="text-sm text-foreground">{PHONE_TEXT}</span>
      </button>
    </div>
  );
}
