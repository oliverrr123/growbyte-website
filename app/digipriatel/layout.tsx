import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";

export default function DigipriatelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LangAttribute locale="sk" />
      {children}
    </>
  );
}
