/** Max contacts shown when Slovak campaign is active (URL param or persisted cookie/storage). */
export const SK_MAX_UTM_SOURCE = "max";

export const SK_MAX_CONTACTS = {
  emails: ["maximilian.oravec@gmail.com", "matustomaskin8@gmail.com"] as const,
  /** E.164 for tel: — no spaces */
  phoneTel: "+421909232279",
  phoneLabel: "+421 909 232 279",
} as const;
