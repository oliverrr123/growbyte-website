import type { Metadata } from "next";
import "./globals.css";
import "../instrumentation-client";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_URL } from "./case-studies/site";
import { headers } from "next/headers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GrowByte",
  description: "Making you more money with AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = headerList.get("x-site-locale") ?? "en";

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)} suppressHydrationWarning>
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
