import type { Metadata } from "next";
import "./globals.css";
import "../instrumentation-client";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body
        className={`font-sf-pro antialiased`}
      >
        <Providers>
          <main className="w-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
