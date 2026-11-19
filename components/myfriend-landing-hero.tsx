"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { LandingLocaleContext, useLandingLocale, useLandingText, type LandingLocale } from "@/components/myfriend-landing-locale";
import { MYFRIEND_FAQS, DIGIPRITEL_FAQS } from "@/lib/elder-companion-seo";
import { FaqAccordion } from "@/components/faq-accordion";
import { MyFriendTryButton } from "@/components/myfriend-try-button";
import { Dialog } from "@base-ui/react/dialog";
import { toast } from "sonner";
import { Copy, X } from "lucide-react";
import { MyFriendLaunchVideo } from "@/components/myfriend-launch-video";
import canvasStyles from "./myfriend-design-canvas.module.css";

const ACCENT = "#ff8804";
const CTA = "rgba(255, 136, 4, 0.9)";
const FOUNDER_PHONE = {
  display: "+1 415 377 1909",
  href: "tel:+14153771909",
  e164: "+14153771909",
} as const;
const CTA_MOTION =
  "origin-center transition-[scale,transform,filter,box-shadow] duration-500 ease-out hover:scale-[1.03] hover:brightness-[1.04] hover:shadow-[0_10px_28px_rgba(255,136,4,0.22)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none";

const TITLE_BRAND_CLASS =
  "inline-block align-baseline text-[52px] sm:text-[64px] leading-none";
const TITLE_BRAND_STYLE = { letterSpacing: "-0.768px" } as const;

function BrandMark({
  punctuation = ",",
  className = "",
  style,
}: {
  punctuation?: "," | "?" | "";
  className?: string;
  style?: CSSProperties;
}) {
  const t = useLandingText();
  return (
    <span className={`caveat-bold-font leading-none ${className}`} style={style}>
      <span className="text-black">{t("my")}</span>
      <span style={{ color: ACCENT }}>{t("friend")}{punctuation}</span>
    </span>
  );
}

function copyText(text: string) {
  if (typeof window !== "undefined" && window.isSecureContext && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.setAttribute("contenteditable", "true");
  field.style.cssText =
    "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:0;outline:none;box-shadow:none;background:transparent;opacity:0;";
  document.body.appendChild(field);
  field.focus();
  field.select();
  field.setSelectionRange(0, text.length);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(field);
  selection?.removeAllRanges();
  selection?.addRange(range);

  try {
    if (!document.execCommand("copy")) {
      throw new Error("copy failed");
    }
  } finally {
    selection?.removeAllRanges();
    document.body.removeChild(field);
  }
}

async function copyPhoneNumber(number: string, t: (text: string) => string) {
  try {
    await copyText(number);
    toast.success(t("Phone number copied"));
  } catch {
    toast.error(t("Could not copy to clipboard"));
  }
}

/** Figma Arrow 01 — wrapper size + transform match design */
function FigmaArrow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden>
      <div className="-scale-y-100 rotate-[135.71deg]">
        <svg width="122" height="136" viewBox="0 0 122 136" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.7219 107.666C48.2285 92.6289 71.9469 77.5917 95.4536 62.5546C95.2418 61.9192 94.8183 61.0721 94.6065 60.4367C84.865 62.131 74.9117 63.8254 65.1702 65.3079C59.4524 66.1551 53.7346 66.7904 48.0168 66.5786C36.1575 66.155 31.9221 57.8952 38.0635 47.7293C40.1812 44.3406 42.7225 40.7402 45.6873 38.1987C60.2995 25.9148 75.1235 14.0546 89.7357 1.98249C90.7946 1.13533 92.0652 0.288181 93.3359 0.0763904C94.3947 -0.1354 96.3007 0.0763774 96.936 0.92354C97.7831 2.19428 98.4184 4.52399 97.5713 5.37115C95.2418 8.33622 92.7005 10.8777 89.9475 13.4192C78.5118 23.3734 66.6526 33.3275 55.217 43.4934C51.8286 46.4585 49.0756 50.4826 44.6284 55.7773C50.3462 55.7773 53.7346 56.2009 57.1229 55.7773C72.1587 53.2359 87.1945 50.2707 102.23 47.7293C105.619 47.0939 109.007 46.2467 112.395 46.8821C115.36 47.3057 119.172 48.7882 120.866 51.1179C123.407 54.5066 121.29 58.3188 118.325 61.0721C115.572 63.6136 112.819 66.1551 109.642 68.273C90.7946 80.5568 72.1587 92.6289 53.311 104.913C50.3462 106.819 47.3814 108.937 42.5107 112.114C55.217 112.325 64.7467 105.125 77.6648 109.36C74.2764 112.537 72.3705 114.867 70.041 116.138C51.4051 125.245 31.4986 131.387 11.1685 135.622C2.69764 137.528 -1.96134 132.022 0.791693 123.55C2.06232 119.738 3.7565 115.926 6.29775 112.749C13.0744 103.854 20.0629 95.1704 27.2631 86.487C28.5338 85.0044 31.4986 83.7337 32.981 84.1573C36.1575 85.428 35.734 88.6048 34.2516 91.1463C31.075 96.6529 27.4749 102.159 24.0866 107.454C24.0866 107.031 24.5101 107.454 24.7219 107.666Z"
            fill="#FF8804"
            fillOpacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}

/** Reserve the layout immediately and reveal only a correctly sized artboard. */
function DesignCanvas({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const availableWidth = canvas.getBoundingClientRect().width;
      // The desktop and mobile versions coexist; measure again when shown.
      if (availableWidth > 0) setScale(availableWidth / width);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={canvasRef}
      className={canvasStyles.canvas}
      style={{
        maxWidth: width,
        aspectRatio: `${width} / ${height}`,
        "--design-width": `${width}px`,
        "--design-height": `${height}px`,
      } as CSSProperties}
    >
      <div
        className={canvasStyles.artboard}
        style={{
          visibility: scale === null ? "hidden" : "visible",
          transform: `scale(${scale ?? 0})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const DESKTOP_AVATARS = [
  { left: 157, top: 905, src: "/images/robo-companion/figma-refresh/avatars/avatar-6-v6.jpg", alt: "Happy MyFriend user" },
  { left: 341, top: 834, src: "/images/robo-companion/figma-refresh/avatars/avatar-2-v6.jpg", alt: "Happy MyFriend user", flipX: true },
  { left: 540, top: 786, src: "/images/robo-companion/figma-refresh/avatars/avatar-3-v6.jpg", alt: "Happy MyFriend user", flipX: true },
  { left: 747, top: 786, src: "/images/robo-companion/figma-refresh/avatars/avatar-4-v6.jpg", alt: "Happy MyFriend user" },
  { left: 965, top: 820, src: "/images/robo-companion/figma-refresh/avatars/avatar-5-v6.jpg", alt: "Happy MyFriend user" },
  { left: 1182, top: 919, src: "/images/robo-companion/figma-refresh/avatars/avatar-1-v6.jpg", alt: "Happy MyFriend user" },
];

const MOBILE_AVATARS = DESKTOP_AVATARS.map(({ src, alt, flipX }) => ({ src, alt, flipX }));

/**
 * Original photo + Figma SVG mask with baked rotation matrix.
 * Mask is applied at group size (viewBox matches rotated absolute bounds).
 */
function FigmaMaskedPhoto({
  photoSrc,
  maskSrc,
  groupWidth,
  groupHeight,
  photoWidth,
  photoHeight,
  photoLeft,
  photoTop,
  alt,
  priority = false,
  masked = true,
  style,
}: {
  photoSrc: string;
  maskSrc: string;
  groupWidth: number;
  groupHeight: number;
  photoWidth: number;
  photoHeight: number;
  photoLeft: number;
  photoTop: number;
  alt: string;
  priority?: boolean;
  masked?: boolean;
  style?: CSSProperties;
}) {
  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url(${maskSrc})`,
    maskImage: `url(${maskSrc})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    maskMode: "luminance",
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: groupWidth, height: groupHeight, ...(masked ? maskStyle : {}), ...style }}
    >
      <div
        className="absolute"
        style={{
          left: photoLeft,
          top: photoTop,
          width: photoWidth,
          height: photoHeight,
        }}
      >
        <Image
          src={photoSrc}
          alt={alt}
          fill
          priority={priority}
          quality={90}
          sizes={`${Math.round(photoWidth * 2)}px`}
          className="object-cover"
        />
      </div>
    </div>
  );
}

function HeroMaskedImage({
  style,
  priority = false,
}: {
  style?: CSSProperties;
  priority?: boolean;
}) {
  const t = useLandingText();
  const locale = useLandingLocale();
  const photo = (
    <FigmaMaskedPhoto
      photoSrc="/images/robo-companion/figma-refresh/hero-photo.jpg"
      maskSrc="/images/robo-companion/figma-refresh/hero-mask.svg?v=2"
      groupWidth={932.384}
      groupHeight={907.272}
      photoWidth={829}
      photoHeight={552}
      photoLeft={49.586}
      photoTop={189.943}
      alt={t("Senior talking on the phone with MyFriend companion")}
      priority={priority}
      masked={locale !== "en"}
    />
  );
  return (
    <div className="absolute" style={{ width: 932.384, height: 907.272, ...style }}>
      {locale === "en" ? <MyFriendLaunchVideo>{photo}</MyFriendLaunchVideo> : photo}
    </div>
  );
}

function FounderMaskedImage({ style }: { style?: CSSProperties }) {
  const t = useLandingText();
  return (
    <FigmaMaskedPhoto
      photoSrc="/images/robo-companion/figma-refresh/founder-photo.jpg"
      maskSrc="/images/robo-companion/figma-refresh/founder-mask.svg?v=2"
      groupWidth={603.623}
      groupHeight={544.612}
      photoWidth={560}
      photoHeight={420}
      photoLeft={44.473}
      photoTop={21.536}
      alt={t("Oliver, creator of MyFriend")}
      style={style}
    />
  );
}

function SectionTitle({
  children,
  id,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`flex w-full max-w-full flex-wrap items-baseline justify-center gap-x-2 gap-y-0 text-center sm:gap-x-3 ${className}`}
    >
      {children}
    </h2>
  );
}

function TitlePlain({ children }: { children: ReactNode }) {
  return (
    <span className="font-medium text-black/80 text-[36px] sm:text-[48px] tracking-[-0.576px] leading-none">
      {children}
    </span>
  );
}

function FeatureGrid({
  items,
  imageSize = 169,
}: {
  items: {
    copy: ReactNode;
    image?: { src: string; alt: string; fit?: "cover" | "contain"; mask?: "edges"; scale?: number; rounded?: boolean };
  }[];
  imageSize?: number;
}) {
  const t = useLandingText();
  return (
    <div className="mt-16 sm:mt-20 mx-auto grid max-w-[920px] grid-cols-1 sm:grid-cols-3 gap-28 sm:gap-12 justify-items-center">
      {items.map((item, i) => (
        <div key={i} className="flex w-full max-w-[280px] flex-col items-center text-center">
          {item.image ? (
            <div
              className={`relative overflow-hidden bg-white ${item.image.rounded === false ? "" : "rounded-[35px]"}`}
              style={{ width: imageSize, height: imageSize }}
            >
              {item.image.src.includes(".svg") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image.src}
                  alt={t(item.image.alt)}
                  className="absolute inset-0 h-full w-full object-contain p-2"
                />
              ) : (
                <Image
                  src={item.image.src}
                  alt={t(item.image.alt)}
                  fill
                  sizes={`${imageSize}px`}
                  className={item.image.fit === "cover" ? "object-cover" : "object-contain p-2"}
                  style={
                    item.image.scale
                      ? { transform: `scale(${item.image.scale})` }
                      : undefined
                  }
                />
              )}
              {item.image.mask === "edges" ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: [
                      "linear-gradient(to right, #fff 0%, transparent 24%, transparent 76%, #fff 100%)",
                      "linear-gradient(to bottom, #fff 0%, transparent 24%, transparent 76%, #fff 100%)",
                    ].join(", "),
                  }}
                />
              ) : null}
            </div>
          ) : (
            <div
              className="rounded-[35px] bg-[#d9d9d9]"
              style={{ width: imageSize, height: imageSize }}
            />
          )}
          <p className="mt-3 max-w-[280px] text-[20px] leading-relaxed tracking-[-0.24px] text-black">
            {item.copy}
          </p>
        </div>
      ))}
    </div>
  );
}

function WhySection() {
  const t = useLandingText();
  return (
    <section className="px-6 pt-40 sm:pt-44 lg:pt-52">
      <div className="mx-auto max-w-[1494px]">
        <SectionTitle>
          <TitlePlain>{t("Why I built")}</TitlePlain>
          <BrandMark punctuation="?" className={TITLE_BRAND_CLASS} style={TITLE_BRAND_STYLE} />
        </SectionTitle>
        <FeatureGrid
          items={[
            {
              image: {
                src: "/images/robo-companion/pictograms/one-of-three.png?v=8",
                alt: "Three seniors, one highlighted",
              },
              copy: (
                <>
                  <strong>{t("1 out of 3 seniors")}</strong> {t("in the US live")} <strong>{t("completely alone")}</strong>
                </>
              ),
            },
            {
              image: {
                src: "/images/robo-companion/pictograms/many-seniors.png?v=9",
                alt: "Many lonely seniors",
                fit: "cover",
                mask: "edges",
                scale: 1.22,
                rounded: false,
              },
              copy: (
                <> {t("That's over")} <strong>{t("16 million lonely seniors")}</strong>
                </>
              ),
            },
            {
              image: {
                src: "/images/robo-companion/pictograms/apart-from-family.png?v=9",
                alt: "A senior separated from family",
              },
              copy: (
                <> {t("Many of them")} <strong>{t("rarely see their family")}</strong>{t(", or not at all.")} </>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}

function WhatSection() {
  const t = useLandingText();
  return (
    <section className="px-6 pt-40 sm:pt-44 lg:pt-48">
      <div className="mx-auto max-w-[1494px]">
        <SectionTitle className="gap-x-0">
          <TitlePlain> {t("What does")}{" "}
            <span className="whitespace-nowrap">
              <BrandMark
                punctuation=""
                className={`${TITLE_BRAND_CLASS} pr-[0.28em]`}
                style={TITLE_BRAND_STYLE}
              /> {t("do?")} </span>
          </TitlePlain>
        </SectionTitle>
        <FeatureGrid
          imageSize={248}
          items={[
            {
              image: {
                src: "/images/robo-companion/pictograms/conversation-phone.png?v=16",
                alt: "Senior talking on the phone with MyFriend",
                fit: "cover",
              },
              copy: (
                <> {t("MyFriend provides")} <strong>{t("24/7 conversation")}</strong> {t("over the phone")} </>
              ),
            },
            {
              image: {
                src: "/images/robo-companion/pictograms/medication-reminder.png?v=16",
                alt: "Senior getting a medication reminder over the phone",
                fit: "cover",
              },
              copy: (
                <>
                  <strong>{t("Reminds of")}</strong> {t("important stuff like")} <strong>{t("taking medications")}</strong> {t("on time")} </>
              ),
            },
            {
              image: {
                src: "/images/robo-companion/pictograms/just-a-phone.png?v=16",
                alt: "Senior using a regular home phone, no app needed",
                fit: "cover",
              },
              copy: (
                <>
                  <strong>{t("No app or internet needed.")}</strong> {t("It's a phone number that you call!")} </>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}

function GetSection() {
  const t = useLandingText();

  return (
    <section className="px-6 pt-40 sm:pt-44 lg:pt-48">
      <div className="mx-auto max-w-[1494px]">
        <SectionTitle id="get-myfriend" className="scroll-mt-[-30px] sm:scroll-mt-[30px]">
          <TitlePlain>{t("Get")}</TitlePlain>
          <BrandMark punctuation="" className={TITLE_BRAND_CLASS} style={TITLE_BRAND_STYLE} />
        </SectionTitle>
        <div className="mx-auto mt-10 flex w-full max-w-[440px] flex-col items-center sm:mt-14">
          <MyFriendTryButton
            className={`inline-flex min-h-[76px] w-full items-center justify-center rounded-[24px] bg-[#ff8804] px-8 py-5 text-center text-[26px] font-medium text-white sm:min-h-[88px] sm:text-[30px] ${CTA_MOTION}`}
          > {t("Get started")} </MyFriendTryButton>
          <DashboardLink className="mt-5 text-center" />
        </div>
      </div>
    </section>
  );
}

function FounderCaption() {
  const t = useLandingText();
  return (
    <p className="m-0 text-center text-black/50 text-[20px] leading-[28px]"> {t("Hey! I'm Oliver, the creator of MyFriend.")} <br /> {t("You can learn more about me")}{" "}
      <a
        href="https://olivercingl.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-[1px] underline-offset-[2px] hover:text-black/70"
      >{t("here")}</a>.
    </p>
  );
}

function FounderPhoto({ scale = 1 }: { scale?: number }) {
  return (
    <div
      className="relative"
      style={{
        width: 603.623 * scale,
        height: 544.612 * scale,
      }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <FounderMaskedImage style={{ left: 0, top: 0 }} />
      </div>
    </div>
  );
}

function FounderContactDialog() {
  const t = useLandingText();
  return (
    <Dialog.Root>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
        <Dialog.Trigger
          className={`inline-flex cursor-pointer items-center justify-center font-medium text-white ${CTA_MOTION}`}
          style={{
            backgroundColor: CTA,
            width: 237,
            height: 71,
            borderRadius: 24,
            fontSize: 24,
          }}
        > {t("Call the founder")} </Dialog.Trigger>
        <Dialog.Trigger className="cursor-pointer bg-transparent p-0 underline decoration-[1px] underline-offset-[2px] text-black/50 transition-colors duration-200 hover:text-black/70 text-[20px] leading-[28px]"> {t("or message")} </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white px-7 pb-7 pt-7 shadow-xl outline-none transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="m-0 text-[28px] font-medium leading-tight tracking-tight text-black"> {t("Call the founder")} </Dialog.Title>
            <Dialog.Close
              className="-mr-1 -mt-0.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
              aria-label={t("Close")}
            >
              <X className="size-5" strokeWidth={2} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-1.5 m-0 text-[18px] leading-snug text-black/60"> {t("Call, message or WhatsApp any time.")} </Dialog.Description>
          <div className="mt-6 grid gap-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/[0.04] px-4 py-3">
              <a href={FOUNDER_PHONE.href} className="min-w-0 text-left no-underline">
                <span className="block text-sm text-black/45">Oliver</span>
                <span className="block text-[22px] font-medium tracking-tight text-black">
                  {FOUNDER_PHONE.display}
                </span>
              </a>
              <button
                type="button"
                onClick={() => copyPhoneNumber(FOUNDER_PHONE.display, t)}
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
                aria-label={t("Copy founder number")}
              >
                <Copy className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FounderSection() {
  const t = useLandingText();
  return (
    <section className="px-6 pt-40 sm:pt-52">
      <div id="contact" className="mx-auto flex max-w-[1100px] scroll-mt-12 flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="w-full max-w-[431px] text-center lg:text-left">
          <h2 className="m-0 font-medium text-black/80 text-[36px] sm:text-[48px] tracking-[-0.576px] leading-[1.05]"> {t("Got any questions whatsoever?")} </h2>
          <FounderContactDialog />
        </div>
        <div className="flex w-full max-w-[604px] flex-col items-center">
          <div className="lg:hidden">
            <FounderPhoto scale={0.72} />
          </div>
          <div className="hidden lg:block">
            <FounderPhoto />
          </div>
          <div className="relative z-10 -mt-16 w-full max-w-[472px] lg:-mt-20">
            <FounderCaption />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const t = useLandingText();
  return (
    <section id="faq" className="px-6 pt-40 sm:pt-44 pb-8">
      <div className="mx-auto max-w-[1024px]">
        <h2 className="m-0 font-medium text-black/80 text-[36px] sm:text-[48px] tracking-[-0.576px] leading-[1.05]"> {t("Frequently asked questions")} </h2>
        <div className="mt-12">
          <FaqAccordion items={useLandingLocale() === "cs" ? DIGIPRITEL_FAQS : MYFRIEND_FAQS} />
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { href: "/myfriend/privacy", label: "Privacy" },
  { href: "/myfriend/terms", label: "Terms" },
  { href: "#contact", label: "Contact" },
];

function LandingFooter() {
  const t = useLandingText();
  const czech = useLandingLocale() === "cs";
  return (
    <footer className="relative overflow-hidden">
      <nav className="relative z-10 flex min-h-[200px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 sm:min-h-[280px]">
        {FOOTER_LINKS.map((link) => {
          const className =
            "text-[14px] leading-5 text-black/50 underline decoration-[1px] underline-offset-[2px] hover:text-black/80";
          const href = czech ? link.href.replace("/myfriend/privacy", "/digipritel/soukromi").replace("/myfriend/terms", "/digipritel/podminky") : link.href;
          const isInternal = href.startsWith("/");
          return isInternal ? (
            <Link key={t(link.label)} href={href} className={className}>
              {t(link.label)}
            </Link>
          ) : (
            <a key={t(link.label)} href={link.href} className={className} onClick={(event) => {
              const target = document.getElementById("contact");
              if (!target) return;
              event.preventDefault();
              window.history.replaceState(null, "", "#contact");
              target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            }}>
              {t(link.label)}
            </a>
          );
        })}
      </nav>

      <div className="relative h-[580px] overflow-hidden sm:h-[870px]">
        <div className="absolute inset-0 scale-[1.02] opacity-70">
          <img
            src="/images/robo-companion/myfriend-doodle-pattern.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)",
          }}
        />

        <div className="relative z-10 flex justify-center pt-[146px] sm:pt-[310px]">
          <MyFriendTryButton
            className="h-[120px] w-[min(584px,86vw)] rounded-[107.5px] text-[32px] sm:h-[215px] sm:text-[64px]"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[280px] items-end justify-center overflow-hidden sm:h-[330px]">
          <BrandMark
            punctuation=""
            className="translate-y-[38%] whitespace-nowrap text-[min(400px,42vw)] tracking-[-4.8px]"
          />
        </div>
      </div>
    </footer>
  );
}

function DashboardLink({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const t = useLandingText();
  const pathname = usePathname();
  const href = useLandingLocale() === "cs" ? "/digipritel/dashboard" : pathname.startsWith("/myfriend") ? "/myfriend/dashboard" : "/dashboard";

  return (
    <Link
      href={href}
      className={`block text-[14px] leading-5 text-black/40 underline underline-offset-4 transition-colors hover:text-black/65 ${className}`}
      style={style}
    > {t("Already a user?")} </Link>
  );
}

function DesktopLanding() {
  const t = useLandingText();
  return (
    <DesignCanvas width={1494} height={1200}>
      <HeroMaskedImage style={{ left: 581, top: -67 }} priority />

      <h1 className="absolute m-0" style={{ left: 132, top: 225 }}>
        <BrandMark style={{ fontSize: 96, lineHeight: "80px", letterSpacing: "-0.84px" }} />
      </h1>

      <p
        className="absolute m-0 font-medium text-black/80 whitespace-pre-wrap"
        style={{
          left: 157,
          top: 331,
          width: 431,
          fontSize: 48,
          letterSpacing: "-0.576px",
          lineHeight: "normal",
        }}
      > {t("the AI companion")} {"\n"}
        {"   "}{t("for elderly people.")} </p>

      <div className="absolute" style={{ left: 179.35, top: 422.04, width: 182.3, height: 182.54 }}>
        <FigmaArrow className="size-full" />
      </div>

      <MyFriendTryButton
        style={{
          left: 384,
          top: 481,
          width: 204,
          height: 71,
          borderRadius: 24,
          fontSize: 24,
          lineHeight: "28px",
        }}
      />
      <DashboardLink className="absolute w-[260px] text-center" style={{ left: 356, top: 568 }} />

      {DESKTOP_AVATARS.map((avatar, i) => (
        <div
          key={i}
          className="absolute overflow-hidden rounded-full bg-neutral-200"
          style={{ left: avatar.left, top: avatar.top, width: 144, height: 142 }}
        >
          <Image
            src={avatar.src}
            alt={t(avatar.alt)}
            fill
            sizes="144px"
            quality={85}
            className={`object-cover${avatar.flipX ? " -scale-x-100" : ""}`}
          />
        </div>
      ))}

      <p
        className="absolute m-0 font-medium text-black/80 text-center -translate-x-1/2 whitespace-nowrap"
        style={{ left: "50%", top: 985, fontSize: 36, letterSpacing: "-0.432px" }}
      > {t("Join 250+ happy users")} </p>

      <MyFriendTryButton
        style={{
          left: 645,
          top: 1057,
          width: 204,
          height: 71,
          borderRadius: 24,
          fontSize: 24,
        }}
      />
    </DesignCanvas>
  );
}

function MobileLanding() {
  const t = useLandingText();
  return (
    <div className="overflow-x-hidden">
      <DesignCanvas width={758} height={790}>
        <HeroMaskedImage style={{ left: -87, top: -72 }} priority />
      </DesignCanvas>

      <div className="relative z-10 mt-4 flex flex-col items-center px-5 pb-16 text-center">
        <h1 className="m-0 w-full text-center">
          <BrandMark
            punctuation=""
            className="inline-block text-[80px]"
            style={{ lineHeight: "1.2", letterSpacing: "-0.84px" }}
          />
        </h1>
        <p className="mt-7 m-0 max-w-[20.5rem] font-medium text-black/80 text-[32px] leading-[1.25] tracking-[-0.4px]"> {t("the AI companion for elderly people.")} </p>

        <div className="relative mt-10">
          <MyFriendTryButton className="h-[72px] w-[248px] rounded-[24px] text-[24px] leading-none" />
          <DashboardLink className="mt-4 text-center" />
        </div>

        <div className="mt-36 flex w-full max-w-full justify-center -space-x-5 overflow-x-hidden">
          {MOBILE_AVATARS.map((avatar, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-full bg-neutral-200 ring-4 ring-white"
              style={{ width: 72, height: 72 }}
            >
              <Image
                src={avatar.src}
                alt={t(avatar.alt)}
                fill
                sizes="72px"
                quality={80}
                className={`object-cover${avatar.flipX ? " -scale-x-100" : ""}`}
              />
            </div>
          ))}
        </div>

        <p className="mt-6 m-0 font-medium text-black/80 text-[28px] tracking-[-0.35px]"> {t("Join 250+ happy users")} </p>

        <MyFriendTryButton className="mt-6 h-[72px] w-[248px] rounded-[24px] text-[24px] leading-none" />
      </div>
    </div>
  );
}

function LandingSections() {
  return (
    <>
      <WhySection />
      <WhatSection />
      <GetSection />
      <FounderSection />
      <FaqSection />
      <LandingFooter />
    </>
  );
}

export function MyFriendLandingHero({ locale = "en" }: { locale?: LandingLocale }) {
  return (
    <LandingLocaleContext.Provider value={locale}>
    <section className="overflow-x-hidden bg-white" lang={locale}>
      <div className="hidden lg:block">
        <DesktopLanding />
      </div>
      <div className="lg:hidden">
        <MobileLanding />
      </div>
      <LandingSections />
    </section>
    </LandingLocaleContext.Provider>
  );
}
