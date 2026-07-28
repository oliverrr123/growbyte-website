import { LangAttribute } from "@/app/solutions/[locale]/lang-attribute";

export default function DigifreundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LangAttribute locale="de" />
      {children}
    </>
  );
}
