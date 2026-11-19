import { MyFriendLogin } from "@/components/myfriend-login";
import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";
export const metadata = { title: "Přihlášení | DigiPřítel", robots: { index: false, follow: false } };
export default function LoginPage() { return <><LangAttribute locale="cs" /><MyFriendLogin locale="cs" /></>; }
