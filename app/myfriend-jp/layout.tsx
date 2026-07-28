import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";

export default function MaiFurendoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LangAttribute locale="ja" />
      {children}
    </>
  );
}
