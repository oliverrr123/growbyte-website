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
        <main className="w-full p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
