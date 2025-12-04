import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

type QrLink = {
  title: string;
  url: string;
  accent: string;
  qrColor: string;
};

const qrLinks: QrLink[] = [
  {
    title: "AI Lab Discord",
    url: "https://discord.gg/bsCB4DwTVf",
    accent: "from-indigo-500/20 via-sky-500/10 to-transparent",
    qrColor: "#1f2937",
  },
  {
    title: "DigiPřítel",
    url: "https://growbyte.co/digipritel",
    accent: "from-orange-500/20 via-amber-400/10 to-transparent",
    qrColor: "#7c2d12",
  },
] as const;

function QrPanel({ title, url, accent, qrColor }: QrLink) {
  return (
    <section className="relative isolate flex flex-col items-center justify-center gap-8 px-6 py-12 sm:px-12">
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-b md:bg-gradient-to-r ${accent}`}
        aria-hidden="true"
      />
      <div className="text-center space-y-4">
        <h2 className="text-4xl sm:text-5xl font-bold text-white">{title}</h2>
      </div>
      <div className="rounded-[32px] bg-white/95 shadow-2xl shadow-black/20 backdrop-blur">
        <QRCodeSVG
          value={url}
          size={480}
          level="H"
          includeMargin
          bgColor="transparent"
          fgColor={qrColor}
        />
      </div>
      <div className="flex flex-col items-center gap-2 text-xl text-white/70">
        <Link
          href={url}
          target="_blank"
          className="font-medium text-white hover:text-white/80 break-all decoration-dotted"
        >
          {url}
        </Link>
      </div>
    </section>
  );
}

export default function QrLanding() {
  return (
    <main className="fixed inset-0 bg-slate-950 text-white overflow-auto">
      <div className="flex min-h-screen w-full flex-col">
        <div className="grid flex-1 grid-cols-1 divide-y divide-white/5 md:grid-cols-2 md:divide-x md:divide-y-0">
          {qrLinks.map((panel) => (
            <QrPanel key={panel.title} {...panel} />
          ))}
        </div>
      </div>
    </main>
  );
}

