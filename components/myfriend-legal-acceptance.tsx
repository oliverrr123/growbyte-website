"use client";

export function MyFriendLegalAcceptance({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="my-5 flex items-start gap-3 text-left text-sm leading-6 text-black/70">
      <input type="checkbox" required checked={checked} onChange={event => onChange(event.target.checked)} className="mt-1 size-4 shrink-0 accent-[#ff8804]" />
      <span>I agree to the <a href="/myfriend/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Terms of Service</a> and acknowledge the <a href="/myfriend/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Privacy Policy</a>. My selected subscription renews until I cancel.</span>
    </label>
  );
}
