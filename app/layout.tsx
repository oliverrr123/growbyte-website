import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowByte",
  description: "Making you more money with AIs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sf-pro antialiased`}
      >
        <main className="w-full p-4 sm:px-[10vw] md:px-[20vw] lg:px-[30vw] xl:px-[30vw] 2xl:px-[35vw]">
          {children}
        </main>
      </body>
    </html>
  );
}
