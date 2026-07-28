import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";

export default function DigipritelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LangAttribute locale="cs" />
      {children}
    </>
  );
}
