"use client";

import Image from "next/image";

import { useSkMaxCampaign } from "@/components/sk-max-campaign-context";
import type { Locale } from "../data";
import { SK_MAX_CONTACTS } from "../sk-max-contacts";

function OliverContactsRow() {
  return (
    <>
      <a href="https://x.com/olivercingl" target="_blank" rel="noopener noreferrer" aria-label="Twitter profile">
        <Image
          src="/icons/twitter-x.svg"
          alt="Twitter"
          className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
          width={32}
          height={32}
        />
      </a>
      <a href="https://linkedin.com/in/olivercingl" target="_blank" rel="noopener noreferrer" aria-label="Linkedin profile">
        <Image
          src="/icons/linkedin.svg"
          alt="LinkedIn"
          className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
          width={32}
          height={32}
        />
      </a>
      <a href="mailto:oliver.cingl@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
        <Image
          src="/icons/mail.svg"
          alt="Email"
          className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
          width={32}
          height={32}
        />
      </a>
      <a href="tel:+420776781248" target="_blank" rel="noopener noreferrer" aria-label="Phone">
        <Image
          src="/icons/phone.svg"
          alt="Phone"
          className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity"
          width={32}
          height={32}
        />
      </a>
    </>
  );
}

function MaxSkContactsRow() {
  return (
    <>
      {SK_MAX_CONTACTS.emails.map((email) => (
        <a key={email} href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" aria-label={`E-mail: ${email}`}>
          <Image src="/icons/mail.svg" alt="" className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity" width={32} height={32} />
        </a>
      ))}
      <a
        href={`tel:${SK_MAX_CONTACTS.phoneTel}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Telefón: ${SK_MAX_CONTACTS.phoneLabel}`}
      >
        <Image src="/icons/phone.svg" alt="" className="w-8 h-8 brightness-0 hover:opacity-100 transition-opacity" width={32} height={32} />
      </a>
    </>
  );
}

export function SolutionsListContactsFooter({ locale }: { locale: Locale }) {
  const { active } = useSkMaxCampaign();
  const useSkMaxContacts = locale === "sk" && active;
  return useSkMaxContacts ? <MaxSkContactsRow /> : <OliverContactsRow />;
}
