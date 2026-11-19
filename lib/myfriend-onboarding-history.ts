import { FUNNEL_STEPS, type FunnelStep } from "./myfriend-onboarding";

const KEY = "myfriendOnboarding";
type Entry = { step: FunnelStep; index: number };
type BrowserHistory = Pick<History, "state" | "pushState" | "replaceState">;

export function readFunnelHistory(state: unknown): Entry | null {
  if (!state || typeof state !== "object") return null;
  const entry = (state as Record<string, unknown>)[KEY] as Partial<Entry> | undefined;
  return entry && FUNNEL_STEPS.includes(entry.step as FunnelStep) &&
    Number.isInteger(entry.index) && Number(entry.index) >= 0
    ? entry as Entry : null;
}

export function writeFunnelHistory(history: BrowserHistory, step: FunnelStep, mode: "push" | "replace", url?: string) {
  const previous = readFunnelHistory(history.state);
  const index = mode === "push" ? (previous?.index ?? -1) + 1 : previous?.index ?? 0;
  const state = { ...history.state, [KEY]: { step, index } };
  if (mode === "push") history.pushState(state, "", url);
  else history.replaceState(state, "", url);
}

export function initializeFunnelHistory(history: BrowserHistory, steps: readonly FunnelStep[], current: FunnelStep, url: string) {
  if (readFunnelHistory(history.state)) {
    writeFunnelHistory(history, current, "replace", url);
    return;
  }
  // A restored draft still needs previous steps on phones without a visible Back button.
  const preceding = steps.slice(0, steps.indexOf(current) + 1)
    .filter(step => step !== "building" || step === current);
  preceding.forEach((step, index) => writeFunnelHistory(history, step, index ? "push" : "replace", url));
}
