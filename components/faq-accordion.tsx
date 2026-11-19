"use client";

import { Fragment, type MouseEvent } from "react";
import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

function scrollToHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;

  const target = document.getElementById(href.slice(1));
  if (!target) return;

  event.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = window.matchMedia("(min-width: 640px)").matches ? 30 : -30;
  const top = window.scrollY + target.getBoundingClientRect().top - offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? "auto" : "smooth",
  });
  history.pushState(null, "", href);
}

function FaqAnswer({ answer, link }: Pick<FaqItem, "answer" | "link">) {
  if (!link || !answer.includes(link.label)) {
    return <>{answer}</>;
  }

  const parts = answer.split(link.label);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 ? (
            <a
              href={link.href}
              onClick={(event) => scrollToHash(event, link.href)}
              className="font-medium text-gray-950 underline decoration-[#ff8804]/70 underline-offset-[3px] transition-colors duration-200 hover:text-[#ff8804]"
            >
              {link.label}
            </a>
          ) : null}
        </Fragment>
      ))}
    </>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root multiple className="grid gap-3">
      {items.map((item) => (
        <Accordion.Item
          key={item.question}
          className="group rounded-lg border border-gray-200 px-5 transition-colors duration-200 hover:border-[#ff8804]/40"
        >
          <Accordion.Header className="m-0">
            <Accordion.Trigger className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-lg font-semibold text-gray-950 outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2">
              <span>{item.question}</span>
              <ChevronDown
                aria-hidden
                className="size-5 shrink-0 text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[open]:rotate-180"
                strokeWidth={2}
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0">
            <p className="pb-5 text-base leading-relaxed text-gray-800">
              <FaqAnswer answer={item.answer} link={item.link} />
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
