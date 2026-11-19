import { AsYouType } from "libphonenumber-js";

export function formatPhoneNumber(value: string) {
  return new AsYouType("US").input(value);
}

const significant = (value: string) => value.replace(/[^+\d]/g, "");

/** Keep editing natural when automatic punctuation is inserted or deleted. */
export function formatPhoneEdit(value: string, previous: string, cursor: number, inputType: string) {
  let raw = significant(value);
  let position = significant(value.slice(0, cursor)).length;
  if (inputType.startsWith("delete") && raw === significant(previous) && value.length < previous.length) {
    const index = inputType === "deleteContentForward" ? position : position - 1;
    if (index >= 0 && index < raw.length) {
      raw = raw.slice(0, index) + raw.slice(index + 1);
      if (index < position) position--;
    }
  }
  const formatted = formatPhoneNumber(raw);
  let caret = 0;
  let count = 0;
  while (caret < formatted.length && count < position) {
    if (/[+\d]/.test(formatted[caret])) count++;
    caret++;
  }
  // Let normal typing continue after any newly inserted separator.
  if (!inputType.startsWith("delete")) {
    while (caret < formatted.length && !/[+\d]/.test(formatted[caret])) caret++;
  }
  return { value: formatted, caret };
}
