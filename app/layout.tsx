import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";

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
        <footer>
          <div className="flex justify-center gap-4 pt-16">
              <a href="https://github.com/oliverrr123/" target="_blank" aria-label="Github profile"><Image src="/icons/github.svg" alt="GitHub" className="w-8 h-8 opacity-75 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
              <a href="https://linkedin.com/in/olivercingl/" target="_blank" aria-label="Linkedin profile"><Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 opacity-75 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
              <a href="mailto:hello@growbyte.co" target="_blank" aria-label="Email"><Image src="/icons/mail.svg" alt="Email" className="w-8 h-8 opacity-75 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
          </div>
          <h6 className="py-6 text-center">© 2025 GrowByte</h6>
      </footer>
      </body>
    </html>
  );
}
