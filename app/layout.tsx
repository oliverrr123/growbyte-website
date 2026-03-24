import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowByte",
  description: "Making you more money with AI",
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
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
