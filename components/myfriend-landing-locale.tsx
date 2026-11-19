"use client";

import { createContext, useContext } from "react";

export type LandingLocale = "en" | "cs";
export const LandingLocaleContext = createContext<LandingLocale>("en");
export const useLandingLocale = () => useContext(LandingLocaleContext);

const czech: Record<string, string> = {
  "my": "digi", "friend": "přítel",
  "Why I built": "Proč vznikl",
  "1 out of 3 seniors": "Každý třetí senior", "in the US live": "v Česku žije", "completely alone": "úplně sám",
  "That's over": "To je přes", "16 million lonely seniors": "700 000 osamělých seniorů",
  "Many of them": "Mnozí z nich", "rarely see their family": "vídají svou rodinu jen zřídka", ", or not at all.": ", nebo vůbec.",
  "What does": "Co", "do?": "umí?",
  "MyFriend provides": "DigiPřítel nabízí", "24/7 conversation": "povídání ve dne i v noci", "over the phone": "po telefonu",
  "Reminds of": "Připomene", "important stuff like": "důležité věci, třeba", "taking medications": "léky", "on time": "ve správný čas",
  "No app or internet needed.": "Bez aplikace a internetu.", "It's a phone number that you call!": "Stačí zavolat na jedno číslo.",
  "Get": "Váš", "Get started": "Začít",
  "Hey! I'm Oliver, the creator of MyFriend.": "Ahoj! Jsem Oliver, tvůrce DigiPřítele.", "You can learn more about me": "Více se o mně dozvíte", "here": "tady",
  "Call the founder": "Zavolejte mi", "or message": "nebo napište", "Call, message or WhatsApp any time.": "Kdykoliv zavolejte, napište SMS nebo na WhatsApp.",
  "Got any questions whatsoever?": "Máte nějaké otázky?", "Frequently asked questions": "Časté otázky", "Already a user?": "Už DigiPřítele používáte?",
  "the AI companion": "AI společník", "for elderly people.": "pro seniory.", "the AI companion for elderly people.": "AI společník pro seniory.",
  "Join 250+ happy users": "Přidejte se k více než 250 spokojeným uživatelům",
  "Privacy": "Soukromí", "Terms": "Podmínky", "Contact": "Kontakt",
  "Close": "Zavřít", "Copy founder number": "Zkopírovat Oliverovo číslo", "Phone number copied": "Číslo je zkopírované", "Could not copy to clipboard": "Číslo se nepodařilo zkopírovat",
  "Happy MyFriend user": "Spokojený uživatel DigiPřítele", "Senior talking on the phone with MyFriend companion": "Senior si povídá s DigiPřítelem po telefonu", "Oliver, creator of MyFriend": "Oliver, tvůrce DigiPřítele",
  "Three seniors, one highlighted": "Tři senioři, jeden zvýrazněný", "Many lonely seniors": "Osamělí senioři", "A senior separated from family": "Senior daleko od rodiny",
  "Senior talking on the phone with MyFriend": "Senior si povídá s DigiPřítelem po telefonu", "Senior getting a medication reminder over the phone": "Telefonické připomenutí léků", "Senior using a regular home phone, no app needed": "Senior používá běžný telefon bez aplikace",
};

export function useLandingText() {
  const locale = useLandingLocale();
  return (text: string) => locale === "cs" ? czech[text] ?? text : text;
}
