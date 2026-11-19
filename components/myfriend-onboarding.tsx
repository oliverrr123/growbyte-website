"use client";

import Link from "next/link";
import { validSetupEmail } from "@/lib/myfriend-checkout-email";
import { MyFriendPaymentSuccess } from "@/components/myfriend-payment-success";
import { MyFriendLegalAcceptance } from "@/components/myfriend-legal-acceptance";
import { MYFRIEND_LEGAL_VERSION } from "@/lib/myfriend-legal";
import { captureOnboarding, checkoutAnalyticsContext } from "@/lib/myfriend-analytics-client";
import { ANALYTICS_EVENTS } from "@/lib/myfriend-analytics";
import Image from "next/image";
import { formatPhoneEdit, formatPhoneNumber } from "@/lib/myfriend-phone-format";
import { initializeFunnelHistory, readFunnelHistory, writeFunnelHistory } from "@/lib/myfriend-onboarding-history";
import { MyFriendTestimonials } from "@/components/myfriend-testimonials";
import { onboardingImage } from "@/lib/myfriend-onboarding-images";
import {
  onboardingCopy,
  selectedCapabilityCopy,
  BUILDING_COPY,
  selectedPlanCopy,
  RELATIONSHIP_NOUNS,
  personalizeOnboardingText,
} from "@/lib/myfriend-onboarding-content";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { MyFriendBrand } from "@/components/myfriend-brand";
import { MYFRIEND_ACCENT, MYFRIEND_PHONES } from "@/lib/myfriend";
import {
  AGE_OPTIONS,
  CADENCE_OPTIONS,
  CONTACT_OPTIONS,
  DISTANCE_OPTIONS,
  EMPTY_ONBOARDING_ANSWERS,
  FUNNEL_STEPS,
  GOAL_OPTIONS,
  HABIT_OPTIONS,
  ONBOARDING_DRAFT_KEY,
  RELATIONSHIP_OPTIONS,
  TECHNOLOGY_OPTIONS,
  restoreOnboardingAnswers,
  onboardingSteps,
  type BillingPlan,
  type FunnelStep,
  type Goal,
  type Habit,
  type OnboardingAnswers,
} from "@/lib/myfriend-onboarding";

const inputClass =
  "mt-3 min-h-16 w-full rounded-[20px] border border-black/10 bg-white px-5 text-xl text-black outline-none transition placeholder:text-black/25 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

type SetupStage = "thank-you" | "buyer" | "senior" | "email" | "welcome" | "done";
type TransitionPhase =
  | "idle"
  | "exiting"
  | "gap"
  | "pre-enter"
  | "entering";
type TransitionDirection = "forward" | "back";
type ChoiceItem = {
  readonly value: string;
  readonly label: string;
  readonly detail?: string;
};

function joinClasses(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function contentTransitionClass(
  phase: TransitionPhase,
  direction: TransitionDirection,
) {
  const base =
    "will-change-[opacity,transform] motion-reduce:transform-none motion-reduce:transition-none";
  if (phase === "exiting") {
    return joinClasses(
      base,
      "pointer-events-none opacity-0 transition-[opacity,transform] duration-200 ease-in",
      direction === "forward" ? "-translate-y-1" : "translate-y-1",
    );
  }
  if (phase === "gap") {
    return joinClasses(base, "pointer-events-none opacity-0 transition-none");
  }
  if (phase === "pre-enter") {
    return joinClasses(
      base,
      "pointer-events-none opacity-0 transition-none",
      direction === "forward" ? "translate-y-3" : "-translate-y-3",
    );
  }
  if (phase === "entering") {
    return joinClasses(
      base,
      "pointer-events-none translate-y-0 opacity-100 transition-[opacity,transform] duration-500 ease-out",
    );
  }
  return joinClasses(base, "translate-y-0 opacity-100");
}

async function post(path: string, body: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Couldn’t continue. Please try again.");
  }
  return data;
}

function Primary({
  children,
  className,
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={joinClasses(
        "mf-primary flex min-h-14 w-full cursor-pointer items-center justify-center rounded-[18px] px-6 py-4 text-[17px] font-semibold text-white shadow-[0_10px_30px_rgba(255,136,4,0.16)] transition duration-200 motion-safe:hover:scale-[1.02] hover:brightness-105 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 motion-reduce:transform-none",
        className,
      )}
      style={{ backgroundColor: MYFRIEND_ACCENT, ...style }}
    >
      {children}
    </button>
  );
}

function BillingPlanCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function select(index: number) {
    const element = track.current;
    if (!element) return;
    setActive(index);
    const card = element.children[index] as HTMLElement;
    element.scrollTo({
      left: card.offsetLeft - (element.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return <>
    <div className="mf-billing-tabs" role="group" aria-label="Billing period">
      {["Monthly", "Annual"].map((label, index) => <button key={label} type="button"
        aria-pressed={active === index} aria-controls="billing-plan-cards"
        onClick={() => select(index)}>{label}</button>)}
    </div>
    <div ref={track} id="billing-plan-cards" className="mf-billing-options" role="group" aria-label="Billing plan"
      onScroll={event => {
        const element = event.currentTarget;
        if (element.scrollWidth > element.clientWidth) {
          setActive(element.scrollLeft > (element.scrollWidth - element.clientWidth) / 2 ? 1 : 0);
        }
      }}>{children}</div>
  </>;
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h1
      tabIndex={-1}
      className="mf-step-heading m-0 text-center text-[30px] font-semibold leading-[1.16] tracking-[-0.035em] text-[#211c17] outline-none sm:text-[38px]"
    >
      {children}
    </h1>
  );
}

function StepLead({
  title,
  body,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
}) {
  return (
    <>
      <Heading>{title}</Heading>
      {body && (
        <div className="mf-step-description mt-4 whitespace-pre-line text-center text-[17px] leading-[1.5] text-black/65 sm:text-[18px]">
          {body}
        </div>
      )}
    </>
  );
}

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7.4 3.6 9.2 7c.3.6.2 1.3-.3 1.8l-1.3 1.3a14.7 14.7 0 0 0 6.3 6.3l1.3-1.3c.5-.5 1.2-.6 1.8-.3l3.4 1.8c.6.3.9.9.8 1.6l-.3 2c-.1.8-.8 1.4-1.6 1.4C10 21.6 2.4 14 2.4 4.7c0-.8.6-1.5 1.4-1.6l2-.3c.7-.1 1.3.2 1.6.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChoiceList({
  options,
  selected,
  onSelect,
  onAdvance,
  multiple = false,
  label,
}: {
  options: readonly ChoiceItem[];
  selected: readonly string[];
  onSelect: (value: string) => void;
  onAdvance?: () => void;
  multiple?: boolean;
  label?: string;
}) {
  return (
    <div
      className="mf-choice-list mt-7 space-y-3"
      role="group"
      aria-label={
        label || (multiple ? "Select all that apply" : "Choose one answer")
      }
    >
      {options.map((option, index) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => {
              onSelect(option.value);
              if (!multiple) onAdvance?.();
            }}
            className={joinClasses(
              "myfriend-choice-in group flex min-h-[62px] w-full cursor-pointer items-center justify-between gap-4 rounded-[16px] border px-4 py-4 text-left transition duration-200 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 motion-reduce:transform-none",
              isSelected
                ? "border-orange-400 bg-orange-50 shadow-[0_8px_28px_rgba(255,136,4,0.08)]"
                : "border-black/[0.08] bg-white hover:border-orange-300 hover:bg-orange-50/40",
            )}
            style={{ animationDelay: 110 + index * 55 + "ms" }}
          >
            <span>
              <span className="mf-choice-label block text-[17px] font-medium leading-snug text-black/80 sm:text-[18px]">
                {option.label}
              </span>
              {option.detail && (
                <span className="mt-1 block text-[14px] leading-snug text-black/60">
                  {option.detail}
                </span>
              )}
            </span>
            <span
              aria-hidden="true"
              className={joinClasses(
                "flex size-6 shrink-0 items-center justify-center border text-[13px] font-bold transition",
                multiple ? "rounded-md" : "rounded-full",
                isSelected
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-black/15 bg-white text-transparent group-hover:border-orange-300",
              )}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}

function relationshipNoun(answers: OnboardingAnswers) {
  return answers.relationship
    ? RELATIONSHIP_NOUNS[answers.relationship]
    : "loved one";
}

function personLabel(answers: OnboardingAnswers) {
  return "your " + relationshipNoun(answers);
}

function sentencePerson(answers: OnboardingAnswers) {
  const person = personLabel(answers);
  return "Your " + person.slice(5);
}

function possessivePerson(answers: OnboardingAnswers) {
  return personLabel(answers) + "’s";
}

function safeResumeStep(
  requestedStep: FunnelStep,
  restoredAnswers: OnboardingAnswers,
) {
  const requestedIndex = FUNNEL_STEPS.indexOf(requestedStep);
  const prerequisites: Array<{
    step: FunnelStep;
    complete: boolean;
  }> = [
    { step: "relationship", complete: Boolean(restoredAnswers.relationship) },
    { step: "goals", complete: restoredAnswers.goals.length > 0 },
    { step: "distance", complete: Boolean(restoredAnswers.distance) },
    {
      step: "remote-contact",
      complete: restoredAnswers.distance === "together" || Boolean(restoredAnswers.remoteContact),
    },
    {
      step: "physical-contact",
      complete: restoredAnswers.distance === "together" || Boolean(restoredAnswers.physicalContact),
    },
    { step: "technology", complete: Boolean(restoredAnswers.technology) },
    { step: "habits", complete: restoredAnswers.habits.length > 0 },
    { step: "cadence", complete: Boolean(restoredAnswers.cadence) },
  ];
  const missing = prerequisites.find(
    (item) =>
      FUNNEL_STEPS.indexOf(item.step) < requestedIndex && !item.complete,
  );
  return missing?.step ?? (onboardingSteps(restoredAnswers).includes(requestedStep) ? requestedStep : "reflection");
}

export function MyFriendOnboarding() {
  const pathname = usePathname();
  const appPrefix = pathname.startsWith("/myfriend") ? "/myfriend" : "";
  const dashboardHref = appPrefix + "/dashboard";

  const [ready, setReady] = useState(false);
  const [stepId, setStepId] = useState<FunnelStep>("intro");
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    EMPTY_ONBOARDING_ANSWERS,
  );
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [plan, setPlan] = useState<BillingPlan>("annual");
  const [stage, setStage] = useState<SetupStage | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("pre-enter");
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("forward");
  const section = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const navigationLocked = useRef(false);
  const navigationToken = useRef(0);
  const stepRef = useRef<FunnelStep>("intro");
  const answersRef = useRef(answers);
  const transitionTimers = useRef<number[]>([]);
  const transitionFrames = useRef<number[]>([]);
  const lastTrackedScreen = useRef("");

  useEffect(() => {
    // Track the restored, visible screen only, not synthetic history entries or exits.
    if (!ready || loadFailed || (transitionPhase !== "idle" && transitionPhase !== "entering")) return;
    const screen = `${stage ? "setup" : "questions"}:${stage || stepId}`;
    if (lastTrackedScreen.current === screen) return;
    lastTrackedScreen.current = screen;
    captureOnboarding(ANALYTICS_EVENTS.screen, { step_id: stage || stepId, phase: stage ? "setup" : "questions" });
  }, [ready, loadFailed, stage, stepId, transitionPhase]);

  const visibleSteps = onboardingSteps(answers);
  const currentIndex = visibleSteps.indexOf(stepId);
  const progress = ((currentIndex + 1) / visibleSteps.length) * 100;
  const person = personLabel(answers);
  const personAtStart = sentencePerson(answers);
  const personPossessive = possessivePerson(answers);
  const copy = onboardingCopy(answers)[stepId];
  const personal = (text: string) => personalizeOnboardingText(text, answers);
  const transitioning = transitionPhase !== "idle";

  useEffect(() => {
    let alive = true;
    let setupRequested = false;
    try {
      const saved = JSON.parse(sessionStorage.getItem(ONBOARDING_DRAFT_KEY) || "null");
      if (saved?.version === 4) {
        const restoredAnswers = restoreOnboardingAnswers(saved.answers);
        setAnswers(restoredAnswers);
        const requestedStep = readFunnelHistory(window.history.state)?.step ??
          (saved.stepId === "name" ? "goals" : saved.stepId);
        if (
          typeof requestedStep === "string" &&
          FUNNEL_STEPS.includes(requestedStep as FunnelStep)
        ) {
          setStepId(
            safeResumeStep(requestedStep as FunnelStep, restoredAnswers),
          );
        }
        if (saved.billingPlan === "monthly" || saved.billingPlan === "annual") {
          setPlan(saved.billingPlan);
        }
      }
    } catch {
      // Draft storage is optional; the flow still works when it is unavailable.
    }

    const params = new URLSearchParams(window.location.search);
    setupRequested = params.has("setup");
    if (params.has("cancelled")) setStepId("pricing");

    fetch("/api/myfriend/onboarding")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!alive) return;
        if (data.paid) {
          if (data.stage === "email" && validSetupEmail(data.email)) {
            await post("/api/myfriend/onboarding", { action: "email", email: data.email });
            if (!alive) return;
            data.stage = "welcome";
          }
          const paidStage: SetupStage = [
            "thank-you",
            "buyer",
            "senior",
            "email",
            "welcome",
            "done",
          ].includes(data.stage)
            ? data.stage
            : "thank-you";
          setStage(paidStage);
          setEmail(data.email || "");
        } else if (setupRequested) {
          throw new Error(
            "Payment is still being confirmed. Please try again in a moment.",
          );
        }
      })
      .catch((caught) => {
        if (alive && setupRequested) {
          setError(caught.message || "Couldn’t load your setup.");
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (alive) setReady(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify({
          version: 4,
          stepId,
          answers,
          billingPlan: plan,
        }),
      );
    } catch {
      // Draft storage is optional.
    }
  }, [answers, plan, ready, stepId]);

  useEffect(() => {
    stepRef.current = stepId;
  }, [stepId]);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    if (!ready || stage || loadFailed) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("cancelled");
    initializeFunnelHistory(window.history, onboardingSteps(answersRef.current), stepRef.current, url.href);
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    function restoreHistory(event: PopStateEvent) {
      const entry = readFunnelHistory(event.state);
      if (!entry) return;
      const target = safeResumeStep(entry.step, answersRef.current);
      // Native back/forward can arrive while our slide transition is still running.
      // Cancel it so a stale timer cannot put the user back on the wrong step.
      navigationToken.current += 1;
      clearTransitionHandles();
      navigationLocked.current = false;
      stepRef.current = target;
      setStepId(target);
      setError("");
      setTransitionPhase("idle");
      writeFunnelHistory(window.history, target, "replace");
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    window.addEventListener("popstate", restoreHistory);
    return () => {
      window.removeEventListener("popstate", restoreHistory);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [ready, stage, loadFailed]);

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTransitionPhase("idle");
      return;
    }
    let secondFrame = 0;
    let finishTimer = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setTransitionPhase("entering");
        finishTimer = window.setTimeout(
          () => setTransitionPhase("idle"),
          500,
        );
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(finishTimer);
    };
  }, [ready]);

  useEffect(
    () => () => {
      navigationToken.current += 1;
      transitionTimers.current.forEach((timer) =>
        window.clearTimeout(timer),
      );
      transitionFrames.current.forEach((frame) =>
        window.cancelAnimationFrame(frame),
      );
    },
    [],
  );

  useEffect(() => {
    if (!ready || transitionPhase !== "idle") return;
    section.current?.querySelector<HTMLElement>("h1")?.focus({
      preventScroll: true,
    });
  }, [codeSent, ready, stage, stepId, transitionPhase]);

  useEffect(() => {
    if (stepId !== "building" || stage) return;
    setBuildProgress(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBuildProgress(100);
      return;
    }
    // Pace the visual reveal in stages, with a brief hold before completion.
    const checkpoints = [[0, 0], [900, 20], [1700, 34], [2800, 68], [3700, 92], [4250, 96], [4650, 96], [5100, 100]];
    const started = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const end = checkpoints.findIndex(([time]) => time > elapsed);
      if (end === -1) {
        setBuildProgress(100);
        window.clearInterval(timer);
        return;
      }
      const [startTime, startValue] = checkpoints[end - 1];
      const [endTime, endValue] = checkpoints[end];
      setBuildProgress(Math.round(startValue + (endValue - startValue) * (elapsed - startTime) / (endTime - startTime)));
    }, 50);
    return () => window.clearInterval(timer);
  }, [stage, stepId]);

  useEffect(() => {
    if (stepId !== "building" || stage || buildProgress !== 100 || transitionPhase !== "idle") return;
    // Leave a moment to see the completion tick before revealing the setup.
    const timer = window.setTimeout(() => {
      if (stepRef.current === "building") next();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [buildProgress, stage, stepId, transitionPhase]);

  async function run(action: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn’t continue.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  function clearTransitionHandles() {
    transitionTimers.current.forEach((timer) =>
      window.clearTimeout(timer),
    );
    transitionFrames.current.forEach((frame) =>
      window.cancelAnimationFrame(frame),
    );
    transitionTimers.current = [];
    transitionFrames.current = [];
  }

  function transitionContent(
    update: () => void,
    direction: TransitionDirection,
  ) {
    if (navigationLocked.current) return;
    clearTransitionHandles();
    setTransitionDirection(direction);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      window.scrollTo({ top: 0, behavior: "instant" });
      setTransitionPhase("idle");
      return;
    }

    navigationLocked.current = true;
    const token = ++navigationToken.current;
    setTransitionPhase("exiting");

    const gapTimer = window.setTimeout(() => {
      if (navigationToken.current === token) setTransitionPhase("gap");
    }, 180);

    const swapTimer = window.setTimeout(() => {
      if (navigationToken.current !== token) return;
      update();
      window.scrollTo({ top: 0, behavior: "instant" });
      setTransitionPhase("pre-enter");

      const firstFrame = window.requestAnimationFrame(() => {
        if (navigationToken.current !== token) return;
        const secondFrame = window.requestAnimationFrame(() => {
          if (navigationToken.current !== token) return;
          setTransitionPhase("entering");
          const finishTimer = window.setTimeout(() => {
            if (navigationToken.current !== token) return;
            navigationLocked.current = false;
            setTransitionPhase("idle");
          }, 500);
          transitionTimers.current.push(finishTimer);
        });
        transitionFrames.current.push(secondFrame);
      });
      transitionFrames.current.push(firstFrame);
    }, 260);

    transitionTimers.current.push(gapTimer, swapTimer);
  }

  function next() {
    advanceWithAnswers(answers);
  }

  function advanceWithAnswers(nextAnswers: OnboardingAnswers) {
    setError("");
    const steps = onboardingSteps(nextAnswers);
    const index = steps.indexOf(stepRef.current);
    const nextStep = steps[index + 1];
    if (!nextStep) return;
    transitionContent(() => {
      writeFunnelHistory(window.history, nextStep, stepRef.current === "building" ? "replace" : "push");
      stepRef.current = nextStep;
      setStepId(nextStep);
    }, "forward");
  }

  function back() {
    setError("");
    if ((readFunnelHistory(window.history.state)?.index ?? 0) > 0) {
      window.history.back();
      return;
    }
    const index = visibleSteps.indexOf(stepRef.current);
    const previousStep = visibleSteps[index - 1];
    if (!previousStep) return;
    transitionContent(() => {
      writeFunnelHistory(window.history, previousStep, "replace");
      stepRef.current = previousStep;
      setStepId(previousStep);
    }, "back");
  }

  function updateAnswer<K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K],
  ) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function toggleGoal(value: Goal) {
    updateAnswer(
      "goals",
      answers.goals.includes(value)
        ? answers.goals.filter((goal) => goal !== value)
        : [...answers.goals, value],
    );
  }

  function toggleHabit(value: Habit) {
    if (value === "none") {
      updateAnswer("habits", answers.habits.includes("none") ? [] : ["none"]);
      return;
    }
    const withoutNone = answers.habits.filter((habit) => habit !== "none");
    updateAnswer(
      "habits",
      withoutNone.includes(value)
        ? withoutNone.filter((habit) => habit !== value)
        : [...withoutNone, value],
    );
  }

  function advanceSetup(nextStage: SetupStage) {
    transitionContent(() => {
      setStage(nextStage);
      setPhone("");
      setCode("");
      setCodeSent(false);
      setHint("");
    }, "forward");
  }

  async function sendCode() {
    const data = await post("/api/myfriend/verify/send", {
      phone,
      audience: stage === "buyer" ? "myself" : "loved-one",
    });
    transitionContent(() => {
      setPhone(formatPhoneNumber(data.phone));
      setHint(data.message || "");
      setCodeSent(true);
      setCode("");
    }, "forward");
  }

  async function verifyCode() {
    await post("/api/myfriend/verify/check", {
      phone,
      code,
      audience: stage === "buyer" ? "myself" : "loved-one",
    });
    const data = await post("/api/myfriend/onboarding", { action: stage });
    advanceSetup(data.stage || (stage === "buyer" ? "senior" : "email"));
  }

  function renderFunnelStep() {
    const single = <K extends keyof OnboardingAnswers>(
      options: readonly (ChoiceItem & { value: OnboardingAnswers[K] })[],
      key: K,
    ) => (
      <ChoiceList options={options.map(option => ({ ...option, label: personal(option.label), ...(option.detail ? { detail: personal(option.detail) } : {}) }))} selected={typeof answers[key] === "string" ? [answers[key] as string] : []}
        onSelect={value => {
          const nextAnswers = { ...answers, [key]: value as OnboardingAnswers[K] };
          setAnswers(nextAnswers);
          advanceWithAnswers(nextAnswers);
        }} />
    );
    const list = (items: string[], separate = false) => <div className={separate ? "mf-capability-list mt-7 space-y-3" : "mf-summary-list"}>{items.map((item, index) => (
      <div key={item} className={separate ? "mf-capability-reveal flex gap-3 rounded-[20px] border border-[#e9e3dc] bg-white px-5 py-[18px] text-[17px] leading-[1.45]" : "mf-summary-row"} style={separate ? { animationDelay: `${160 + index * 220}ms` } : undefined}><span aria-hidden="true" className="shrink-0 text-[#cb5100]">✓</span><p>{item}</p></div>
    ))}</div>;
    let content: ReactNode = null;
    switch (stepId) {
      case "intro":
        content = (
          <Image
            {...onboardingImage("intro", answers.relationship)}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 639px) 560px, 536px"
            priority
            className="mf-illustration mx-auto mt-6 h-auto w-full rounded-[24px]"
          />
        );
        break;
      case "relationship": content = single(RELATIONSHIP_OPTIONS, "relationship"); break;
      case "goals": content = <ChoiceList options={GOAL_OPTIONS.map(option => ({ ...option, label: personal(option.label) }))} selected={answers.goals} multiple onSelect={value => toggleGoal(value as Goal)} />; break;
      case "capabilities": content = list(selectedCapabilityCopy(answers), true); break;
      case "age": content = <>{single(AGE_OPTIONS, "age")}<button type="button" className="mf-skip" onClick={() => { updateAnswer("age", ""); next(); }}>Skip</button></>; break;
      case "distance": content = single(DISTANCE_OPTIONS, "distance"); break;
      case "remote-contact": content = single(CONTACT_OPTIONS, "remoteContact"); break;
      case "physical-contact": content = single(CONTACT_OPTIONS, "physicalContact"); break;
      case "reflection":
        content = (
          <Image
            {...onboardingImage("reflection", answers.relationship)}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 639px) 560px, 536px"
            className="mf-illustration mt-7 h-auto w-full rounded-[24px]"
          />
        );
        break;
      case "technology": content = single(TECHNOLOGY_OPTIONS, "technology"); break;
      case "technology-response":
        content = (
          <Image
            {...onboardingImage("technology", answers.relationship)}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 639px) 560px, 536px"
            className="mf-illustration mt-7 h-auto w-full rounded-[24px]"
          />
        );
        break;
      case "habits": content = <ChoiceList options={HABIT_OPTIONS} selected={answers.habits} multiple onSelect={value => toggleHabit(value as Habit)} />; break;
      case "reminders":
        content = (
          <Image
            {...onboardingImage("reminders", answers.relationship)}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 639px) 560px, 536px"
            className="mf-illustration mt-7 h-auto w-full rounded-[24px]"
          />
        );
        break;
      case "cadence":
        content = <>
          {single(CADENCE_OPTIONS.filter(option => option.value !== "inbound-only"), "cadence")}
          <button type="button" className="mf-skip" onClick={() => {
            const nextAnswers: OnboardingAnswers = { ...answers, cadence: "inbound-only" };
            setAnswers(nextAnswers);
            advanceWithAnswers(nextAnswers);
          }}>skip</button>
        </>;
        break;
      case "reports":
        content = (
          <Image
            {...onboardingImage("reports", answers.relationship)}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 639px) 560px, 536px"
            className="mf-illustration mt-7 h-auto w-full rounded-[24px]"
          />
        );
        break;
      case "building":
        content = <div className={"mf-build-scene" + (buildProgress === 100 ? " is-complete" : "")}>
          <div className="mf-build-orbit" role="progressbar" aria-label={personal("Personalizing {possessive} plan")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={buildProgress}>
            <div className="mf-build-halo" aria-hidden="true" />
            <svg className="mf-build-ring" viewBox="0 0 224 224" aria-hidden="true">
              <circle className="mf-build-ring-track" cx="112" cy="112" r="100" />
              <circle className="mf-build-ring-fill" cx="112" cy="112" r="100" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - buildProgress} />
            </svg>
            <div className="mf-build-number" aria-hidden="true">{buildProgress}<span>%</span></div>
            <span className="mf-build-complete-mark" aria-hidden="true">✓</span>
          </div>
          <p className="mf-build-caption">{personal("Personalizing {possessive} plan")}</p>
          <div className="mf-build-stages">{BUILDING_COPY.map((item, i) => {
            const threshold = [34, 68, 100][i];
            const done = buildProgress >= threshold;
            const active = !done && buildProgress >= [0, 34, 68][i];
            return <div key={item} className={"mf-build-stage " + (done ? "is-done" : active ? "is-active" : "is-pending")}>
              <span className="mf-build-stage-icon" aria-hidden="true">{done ? "✓" : null}</span>
              <p>{item}</p>
              {active && <span className="mf-build-dots" aria-hidden="true"><i /><i /><i /></span>}
            </div>;
          })}</div>
        </div>;
        break;
      case "plan": content = list(selectedPlanCopy(answers), true); break;
      case "cost":
        content = <figure className="mf-cost-comparison" aria-label="Monthly cost comparison: in-home caregiver, rounded national median $6,700 for 44 hours per week; MyFriend AI phone companion, $25.">
          <div className="mf-cost-plot" aria-hidden="true">
            <div className="mf-cost-columns">
              <div className="mf-cost-column">
                <div className="mf-cost-value" style={{ bottom: `calc(${6700 / 8000 * 100}% + 12px)`, backgroundColor: "#fffdf9" }}><strong>$6,700</strong><span>/ mo</span></div>
                <div className="mf-cost-bar is-caregiver" style={{ height: `${6700 / 8000 * 100}%` }} />
              </div>
              <div className="mf-cost-column">
                <div className="mf-cost-savings"><strong>268x</strong><span>cheaper</span></div>
                <div className="mf-cost-value is-myfriend" style={{ bottom: `calc(${25 / 8000 * 100}% + 12px)` }}><strong>$25</strong><span>/ mo</span></div>
                <div className="mf-cost-bar is-myfriend" style={{ height: `${25 / 8000 * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="mf-cost-labels">
            <div><b>In-home caregiver</b></div>
            <div><b>MyFriend</b></div>
          </div>
          <figcaption className="mf-cost-source">
            <p>U.S. caregiver costs: about <strong>$4,600–$8,800/month</strong> across state medians, at 44 hours/week. <a href="https://assets.carescout.com/x/5c90319b6a/298701.pdf" target="_blank" rel="noreferrer">CareScout 2025 Cost of Care Survey</a></p>
          </figcaption>
        </figure>;
        break;
      case "pricing": content = <>
        <MyFriendLegalAcceptance checked={legalAccepted} onChange={setLegalAccepted} />
        <BillingPlanCarousel>{(["monthly", "annual"] as const).map(value => <div key={value} className={"mf-billing-option mf-billing-card mf-billing-card-" + value} role="group" aria-labelledby={"billing-" + value}>
          <div className="mf-billing-card-details"><p id={"billing-" + value} className="mf-plan-rate">{value === "monthly" ? "$25" : "$250"}<span className="mf-plan-period">{value === "monthly" ? " / month" : " / year"}</span></p></div>
          {value === "annual" && <span className="mf-save" style={{ backgroundColor: MYFRIEND_ACCENT }}>Save $50</span>}
          <Primary className="mf-plan-checkout" style={value === "monthly" ? { backgroundColor: "transparent" } : undefined} disabled={busy || !legalAccepted} data-plan={value} onClick={() => {
            setPlan(value);
            void run(async () => {
              try {
                const data = await post("/api/myfriend/onboarding", { action: "checkout", plan: value, answers, legal: { accepted: legalAccepted, version: MYFRIEND_LEGAL_VERSION }, analytics: checkoutAnalyticsContext() });
                captureOnboarding(ANALYTICS_EVENTS.checkout, { billing_plan: value });
                window.location.assign(data.url);
              } catch (error) {
                captureOnboarding(ANALYTICS_EVENTS.checkoutError, { billing_plan: value });
                throw error;
              }
            });
          }}>{busy && plan === value ? "Opening checkout…" : "Continue with " + value}</Primary>
        </div>)}</BillingPlanCarousel>
        <p className="mf-checkout-trust">Secure checkout · Direct phone support from the founder</p>
        <MyFriendTestimonials />
      </>; break;
    }
    const canContinue = (stepId !== "goals" || answers.goals.length > 0) && (stepId !== "habits" || answers.habits.length > 0) && (stepId !== "building" || buildProgress === 100);
    return <div className={"mf-step mf-step-" + stepId}>
      <div><StepLead title={copy.title} body={copy.body} />{content}{copy.note && stepId !== "intro" && <p className="mf-fine-print text-center">{copy.note}</p>}</div>
      {copy.action && stepId !== "building" && <div className="mf-step-action">
        {stepId === "intro" && <p className="mf-intro-duration mb-5 text-center text-[18px] leading-normal text-black/75">{copy.note}</p>}
        <Primary disabled={!canContinue} onClick={next}>{copy.action}</Primary>
      </div>}
    </div>;
  }

  function renderSetup() {
    if (stage === "thank-you") {
      return (
        <MyFriendPaymentSuccess>
            <Primary disabled={busy} onClick={() => void run(async () => {
              const data = await post("/api/myfriend/onboarding", { action: "thank-you" });
              advanceSetup(data.stage || "buyer");
            })}>{busy ? "Please wait…" : "Continue"}</Primary>

        </MyFriendPaymentSuccess>
      );
    }
    if (stage === "buyer" || stage === "senior") {
      const isBuyer = stage === "buyer";
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run(codeSent ? verifyCode : sendCode);
          }}
        >
          <StepLead
            eyebrow={isBuyer ? "Secure your account" : "Invite your loved one"}
            title={
              codeSent
                ? "Enter the verification code"
                : isBuyer
                  ? "First, verify your phone."
                  : "Now ask " + person + " to join you."
            }
            body={
              codeSent ? (
                <>We sent a 6-digit code to <span className="whitespace-nowrap">{formatPhoneNumber(phone)}</span>.</>
              ) : isBuyer ? (
                <>
                  This keeps your account secure and lets you finish setup from
                  this phone.
                </>
              ) : (
                <>
                  {personal("Ask your {relationship} if {subject}’d like to try MyFriend. Enter {possessive} number while you’re together, or ask {object} to read you the code. You can also do this later.")}
                </>
              )
            }
          />
          <label className="mt-7 block text-[14px] font-medium text-black/55">
            {codeSent
              ? "6-digit code"
              : isBuyer
                ? "Your phone number"
                : personal("{Possessive} phone number")}
            <input
              key={codeSent ? "code" : "phone"}
              className={inputClass}
              type={codeSent ? "text" : "tel"}
              inputMode={codeSent ? "numeric" : "tel"}
              autoComplete={codeSent ? "one-time-code" : "tel"}
              placeholder={codeSent ? "000000" : "+1 555 123 4567"}
              maxLength={codeSent ? 6 : 30}
              value={codeSent ? code : phone}
              onChange={(event) => {
                if (codeSent) {
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  return;
                }
                const input = event.currentTarget;
                const formatted = formatPhoneEdit(input.value, phone, input.selectionStart ?? input.value.length, (event.nativeEvent as InputEvent).inputType || "insertText");
                input.value = formatted.value;
                input.setSelectionRange(formatted.caret, formatted.caret);
                setPhone(formatted.value);
              }}
              required
            />
          </label>
          {hint && (
            <p role="status" className="mt-3 text-sm text-black/60">
              {hint}
            </p>
          )}
          <div className="mt-6">
            <Primary
              type="submit"
              disabled={
                busy || (codeSent ? code.length !== 6 : !phone.trim())
              }
            >
              {busy
                ? "Please wait…"
                : codeSent
                  ? "Verify & continue"
                  : "Send verification code"}
            </Primary>
          </div>
          {codeSent && (
            <div className="mt-4 flex justify-between text-sm">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  transitionContent(() => {
                    setCodeSent(false);
                    setError("");
                    setHint("");
                  }, "back");
                }}
                className="cursor-pointer py-2 text-black/60 underline underline-offset-4 hover:text-black"
              >
                Change number
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => run(sendCode)}
                className="cursor-pointer py-2 text-black/60 underline underline-offset-4 hover:text-black"
              >
                Resend code
              </button>
            </div>
          )}
          {!isBuyer && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const data = await post("/api/myfriend/onboarding", {
                    action: "skip-senior",
                  });
                  advanceSetup(data.stage || "email");
                })
              }
              className="mt-6 w-full cursor-pointer py-3 text-sm text-black/60 underline underline-offset-4 hover:text-black"
            >
              {personal("Add {possessive} number later")}
            </button>
          )}
        </form>
      );
    }

    if (stage === "email") {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run(async () => {
              await post("/api/myfriend/onboarding", {
                action: "email",
                email,
              });
              advanceSetup("welcome");
            });
          }}
        >
          <StepLead
            eyebrow="One last account detail"
            title="Add a recovery email."
            body="We’ll use this if you ever need help getting back into your account."
          />
          <label className="mt-7 block text-[14px] font-medium text-black/55">
            Email address
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <div className="mt-6">
            <Primary disabled={busy || !email.trim()}>
              {busy ? "Saving…" : "Continue"}
            </Primary>
          </div>
        </form>
      );
    }

    if (stage === "welcome") {
      return (
        <>
          <StepLead
            eyebrow="Your account is ready"
            title={personAtStart + personal(" can meet MyFriend when {subjectBe} ready.")}
            body={personal("Once {possessive} number is added, {subject} can call MyFriend for a gentle introduction. No recurring calls are scheduled unless {subject} {agree} during that conversation.")}
          />
          <div className="mt-8 space-y-3">
            {[
              "MyFriend introduces itself and explains the experience.",
              personAtStart + " decides whether friendly calls sound good and when.",
              personal("{Subject} can set simple reminders naturally during a phone call."),
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-[20px] border border-black/[0.07] bg-white p-5"
              >
                <span className="caveat-bold-font flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-700">
                  {index + 1}
                </span>
                <p className="text-[16px] leading-relaxed text-black/60">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[22px] border border-orange-200 bg-orange-50/70 p-5">
            <p className="mt-2 text-[17px] font-medium leading-relaxed text-black/75">
              On {personPossessive} phone, call MyFriend:
            </p>
            <a
              href={MYFRIEND_PHONES.us.href}
              className="mt-4 flex min-h-14 items-center justify-center gap-3 rounded-[16px] bg-white px-4 text-[22px] font-semibold tracking-[-0.02em] text-orange-700 shadow-sm transition hover:bg-orange-100/60"
              aria-label={"Call MyFriend at " + MYFRIEND_PHONES.us.display}
            >
              <PhoneGlyph className="size-5" />
              {MYFRIEND_PHONES.us.display}
            </a>
          </div>
          <div className="mt-6 rounded-[22px] bg-[#262019] p-5 text-white">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/65">
              A direct line to the founder
            </p>
            <p className="mt-2 text-[16px] leading-relaxed text-white/76">
              I’m Oliver. If you need help, have feedback, or simply want to
              talk something through, call or message me.
            </p>
            <a
              href="tel:+14153771909"
              className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-[15px] font-medium text-white hover:bg-white/15"
            >
              +1 415 377 1909
            </a>
          </div>
          <div className="mt-7">
            <Primary
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await post("/api/myfriend/onboarding", {
                    action: "finish",
                  });
                  captureOnboarding(ANALYTICS_EVENTS.complete, { phase: "setup" });
                  try {
                    sessionStorage.removeItem(ONBOARDING_DRAFT_KEY);
                  } catch {
                    // Draft storage is optional.
                  }
                  window.location.assign(dashboardHref);
                })
              }
            >
              {busy ? "Finishing setup…" : "Open my dashboard"}
            </Primary>
          </div>
        </>
      );
    }

    return (
      <>
        <StepLead
          eyebrow="Setup complete"
          title="You’re all set."
          body="Your MyFriend is set up! If you need to change anything, you can simply text / call MyFriend yourself."
        />
        <Primary
          className="mt-8"
          disabled={busy}
          onClick={() => run(async () => {
            await navigator.clipboard.writeText(MYFRIEND_PHONES.us.display);
            setHint("Copied");
          })}
        >
          Copy number
        </Primary>
        {hint && <p role="status" className="mt-3 text-sm text-black/60">{hint}</p>}
      </>
    );
  }

  return (
    <main className="mf-onboarding min-h-dvh bg-[#fffdf9] text-black">
      {!stage && (
        <header className="mf-onboarding-header mx-auto w-full max-w-[600px] px-5 pt-6 sm:px-8 sm:pt-8">
          <div
            className="flex justify-center"
            role="img"
            aria-label="MyFriend"
          >
            <MyFriendBrand className="mf-onboarding-brand text-[36px] sm:text-[42px]" />
          </div>

          <div className="mt-3 flex items-center gap-3 sm:mt-4 sm:gap-4">
            {currentIndex > 0 ? (
              <button
                type="button"
                aria-label="Back"
                onClick={back}
                disabled={busy || transitioning}
                className="hidden size-11 shrink-0 cursor-pointer items-center justify-center text-[27px] leading-none text-black/70 transition hover:text-orange-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transform-none sm:flex"
              >
                <span aria-hidden="true" className="-translate-y-px">
                  ←
                </span>
              </button>
            ) : (
              <Link
                href={appPrefix || "/"}
                aria-label="Back"
                className="hidden size-11 shrink-0 items-center justify-center text-[27px] leading-none text-black/70 transition hover:text-orange-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-500 motion-reduce:transform-none sm:flex"
              >
                <span aria-hidden="true" className="-translate-y-px">
                  ←
                </span>
              </Link>
            )}

            <div
              role="progressbar"
              aria-label="Onboarding progress"
              aria-valuemin={1}
              aria-valuemax={visibleSteps.length}
              aria-valuenow={currentIndex + 1}
              aria-valuetext={`Step ${currentIndex + 1} of ${visibleSteps.length}`}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-orange-100"
            >
              <div
                className="h-full rounded-full bg-orange-500 transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: progress + "%" }}
              />
            </div>
          </div>
        </header>
      )}

      <div
        ref={section}
        className="mf-onboarding-content mx-auto w-full max-w-[600px] px-5 pb-10 pt-3 sm:px-8 sm:pb-14 sm:pt-4"
      >
        {!ready ? (
          <p role="status" className="py-20 text-center text-sm text-black/60">
            Loading your setup…
          </p>
        ) : loadFailed ? (
          <>
            <StepLead
              eyebrow="Your setup"
              title="Let’s get you back to where you left off."
            />
            <p
              role="alert"
              className="my-6 rounded-[18px] bg-red-50 p-4 text-red-700"
            >
              {error}
            </p>
            <Primary onClick={() => window.location.reload()}>
              Try again
            </Primary>
          </>
        ) : (
          <>
            <div
              data-testid="onboarding-content"
              data-transition-phase={transitionPhase}
              key={
                stage
                  ? "setup:" + stage + ":" + String(codeSent)
                  : "funnel:" + stepId
              }
              className={contentTransitionClass(
                transitionPhase,
                transitionDirection,
              )}
              aria-busy={transitioning}
            >
              {stage ? renderSetup() : renderFunnelStep()}

              {error && (
                <p
                  role="alert"
                  className="mt-5 rounded-[16px] border border-red-100 bg-red-50 p-4 text-[15px] leading-relaxed text-red-700"
                >
                  {error}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
