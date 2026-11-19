export type CheckinFrequency = "daily" | "multiple" | "weekly";
export type CheckinWindow = { start: number; end: number };
export type CheckinSchedule = {
  enabled: boolean;
  frequency: CheckinFrequency;
  weekdays: number[];
  windows: CheckinWindow[];
  timezone: string;
};
export const WEEKDAYS = [
  { value: 1, label: "Mon" }, { value: 2, label: "Tue" }, { value: 3, label: "Wed" },
  { value: 4, label: "Thu" }, { value: 5, label: "Fri" }, { value: 6, label: "Sat" }, { value: 0, label: "Sun" },
];
export const SCHEDULE_TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Phoenix", label: "Arizona Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "Europe/London", label: "UK Time" },
  { value: "Europe/Prague", label: "Central European Time" },
];
export function defaultCheckinSchedule(timezone = "America/Los_Angeles"): CheckinSchedule {
  return { enabled: false, frequency: "daily", weekdays: [0,1,2,3,4,5,6], windows: [{ start: 1080, end: 1260 }], timezone };
}
export function validateCheckinSchedule(value: unknown): { schedule: CheckinSchedule; error?: never } | { error: string; schedule?: never } {
  if (!value || typeof value !== "object") return { error: "Choose a check-in schedule." };
  const p = value as CheckinSchedule;
  if (typeof p.enabled !== "boolean" || !["daily", "multiple", "weekly"].includes(p.frequency)) return { error: "Choose how often to check in." };
  if (!Array.isArray(p.weekdays) || !p.weekdays.length || p.weekdays.some(d => !Number.isInteger(d) || d < 0 || d > 6)) return { error: "Choose at least one weekday." };
  if (!Array.isArray(p.windows) || p.windows.length < 1 || p.windows.length > 4 || (p.frequency === "multiple" ? p.windows.length < 2 : p.windows.length !== 1)) return { error: "Choose a time window for each call." };
  for (const w of p.windows) {
    if (!w || !Number.isInteger(w.start) || !Number.isInteger(w.end) || w.start < 0 || w.end > 1440 || w.start % 30 || w.end % 30 || w.end - w.start < 30) return { error: "Each window must end after it starts, on the same day." };
  }
  const windows = p.windows.map(w => ({ start: w.start, end: w.end })).sort((a,b) => a.start-b.start);
  if (windows.some((w,i) => i > 0 && w.start < windows[i-1].end)) return { error: "Choose time windows that don’t overlap." };
  if (typeof p.timezone !== "string" || !p.timezone) return { error: "Choose their timezone." };
  try { new Intl.DateTimeFormat("en", { timeZone: p.timezone }).format(); } catch { return { error: "Choose a valid timezone." }; }
  return { schedule: { enabled: p.enabled, frequency: p.frequency, weekdays: p.frequency === "weekly" ? [...new Set(p.weekdays)].sort((a,b)=>a-b) : [0,1,2,3,4,5,6], windows, timezone: p.timezone } };
}
export function scheduleTime(minutes: number) {
  const hour = Math.floor(minutes / 60) % 24;
  return `${hour % 12 || 12}${minutes % 60 ? ":30" : ""} ${hour >= 12 ? "PM" : "AM"}`;
}
export function scheduleSummary(schedule: CheckinSchedule) {
  if (!schedule.enabled) return "Off";
  const days = schedule.frequency === "weekly" ? WEEKDAYS.filter(d=>schedule.weekdays.includes(d.value)).map(d=>d.label).join(", ") : schedule.frequency === "multiple" ? `${schedule.windows.length} times a day` : "Every day";
  return `${days} · ${schedule.windows.map(w=>`${scheduleTime(w.start)}–${scheduleTime(w.end)}`).join(", ")}`;
}
export function scheduleTimezoneLabel(timezone: string) {
  return SCHEDULE_TIMEZONES.find(t=>t.value===timezone)?.label ?? timezone.replaceAll("_", " ");
}
