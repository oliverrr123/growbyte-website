// Keep provider errors understandable without exposing English implementation text.
export function czechAccountError(message: unknown, status?: number) {
  if (status === 401) return "Přihlaste se prosím znovu.";
  if (status === 429) return "Příliš mnoho pokusů. Zkuste to prosím za chvíli.";
  const text = typeof message === "string" ? message : "";
  if (/phone number|phone.*invalid|invalid.*phone/i.test(text)) return "Zadejte platné telefonní číslo včetně předvolby.";
  if (/code|verification/i.test(text)) return "Kód se nepodařilo ověřit. Zkontrolujte ho nebo si nechte poslat nový.";
  if (/email/i.test(text)) return "Zkontrolujte e-mailovou adresu a zkuste to znovu.";
  if (/billing|subscription/i.test(text)) return "Správa předplatného je momentálně nedostupná. Zkuste to za chvíli.";
  if (/timezone/i.test(text)) return "Vyberte platné časové pásmo.";
  return "Požadavek se nepodařilo dokončit. Zkuste to prosím znovu.";
}
