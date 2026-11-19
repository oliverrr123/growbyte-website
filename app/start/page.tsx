import { MyFriendPhoneOnboarding } from "@/components/myfriend-phone-onboarding";
import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";
export const metadata = { title: "Zavolejte DigiPříteli", robots: { index: false, follow: false } };
export default function StartPage() { return <><LangAttribute locale="cs" /><MyFriendPhoneOnboarding /></>; }
