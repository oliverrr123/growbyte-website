import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";

export default function MyFriendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LangAttribute locale="en" />
      {children}
    </>
  );
}
