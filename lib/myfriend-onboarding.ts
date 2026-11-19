export const ONBOARDING_DRAFT_KEY = "myfriend-loved-one-v4";

export const FUNNEL_STEPS = [
  "intro",
  "relationship",
  "goals",
  "capabilities",
  "age",
  "distance",
  "remote-contact",
  "physical-contact",
  "reflection",
  "technology",
  "technology-response",
  "habits",
  "reminders",
  "cadence",
  "reports",
  "building",
  "plan",
  "cost",
  "pricing",
] as const;

export type FunnelStep = (typeof FUNNEL_STEPS)[number];
export type BillingPlan = "monthly" | "annual";

export const RELATIONSHIP_OPTIONS = [
  { value: "mom", label: "My mom" },
  { value: "dad", label: "My dad" },
  { value: "grandmother", label: "My grandma" },
  { value: "grandfather", label: "My grandpa" },
  { value: "partner", label: "My partner" },
  { value: "someone-else", label: "Someone else I care about" },
] as const;

export const GOAL_OPTIONS = [
  { value: "conversation", label: "Give {object} a companion {subject} can call 24/7" },
  { value: "questions", label: "Help {object} stay more independent" },
  { value: "reminders", label: "Remind {object} of important stuff like taking medications" },
  { value: "checkins", label: "Check up on {object} every day so you know {subjectBe} okay" },
  { value: "family-contact", label: "Encourage me to call / message / visit {object} more" },
] as const;

export const AGE_OPTIONS = [
  { value: "under-60", label: "Under 60" },
  { value: "60-69", label: "60-70" },
  { value: "70-79", label: "70-80" },
  { value: "80-89", label: "80-90" },
  { value: "90-plus", label: "90+" },
] as const;

export const DISTANCE_OPTIONS = [
  { value: "together", label: "We live together" },
  { value: "nearby", label: "We live nearby" },
  { value: "far-apart", label: "We live far apart" },
] as const;

export const CONTACT_OPTIONS = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "A few times a week" },
  { value: "monthly", label: "A few times a month" },
  { value: "yearly", label: "A few times a year" },
] as const;

export const TECHNOLOGY_OPTIONS = [
  { value: "avoids", label: "{Subject} mostly {avoid} it" },
  { value: "web", label: "{Subject} {use} phones and the web for basic things" },
  { value: "ai", label: "{SubjectBe} curious about AI and new technology" },
  { value: "unsure", label: "I’m not sure" },
] as const;

export const HABIT_OPTIONS = [
  { value: "medication", label: "Medication times" },
  { value: "routines", label: "Daily routines and small tasks" },
  { value: "appointments", label: "Appointments and plans" },
  { value: "none", label: "Nothing specific right now" },
] as const;

export const CADENCE_OPTIONS = [
  { value: "multiple-daily", label: "Multiple times per day" },
  { value: "daily", label: "Every day" },
  { value: "few-weekly", label: "Few times each week" },
  { value: "inbound-only", label: "skip" },
] as const;

type OptionValue<T extends readonly { value: string }[]> = T[number]["value"];

export type Relationship = OptionValue<typeof RELATIONSHIP_OPTIONS>;
export type Goal = OptionValue<typeof GOAL_OPTIONS>;
export type AgeRange = OptionValue<typeof AGE_OPTIONS>;
export type Distance = OptionValue<typeof DISTANCE_OPTIONS>;
export type ContactFrequency = OptionValue<typeof CONTACT_OPTIONS>;
export type TechnologyComfort = OptionValue<typeof TECHNOLOGY_OPTIONS>;
export type Habit = OptionValue<typeof HABIT_OPTIONS>;
export type Cadence = OptionValue<typeof CADENCE_OPTIONS>;

export type OnboardingAnswers = {
  relationship: Relationship | "";
  goals: Goal[];
  age: AgeRange | "";
  distance: Distance | "";
  remoteContact: ContactFrequency | "";
  physicalContact: ContactFrequency | "";
  technology: TechnologyComfort | "";
  habits: Habit[];
  cadence: Cadence | "";
  committed: boolean;
};

export const EMPTY_ONBOARDING_ANSWERS: OnboardingAnswers = {
  relationship: "",
  goals: [],
  age: "",
  distance: "",
  remoteContact: "",
  physicalContact: "",
  technology: "",
  habits: [],
  cadence: "",
  committed: false,
};

export function onboardingSteps(answers: OnboardingAnswers): FunnelStep[] {
  return FUNNEL_STEPS.filter(step => answers.distance !== "together" ||
    (step !== "remote-contact" && step !== "physical-contact"));
}

function isOptionValue<T extends readonly { value: string }[]>(
  value: unknown,
  options: T,
): value is OptionValue<T> {
  return typeof value === "string" && options.some((option) => option.value === value);
}

function optionValues<T extends readonly { value: string }[]>(value: unknown, options: T) {
  if (!Array.isArray(value)) return [] as OptionValue<T>[];
  return Array.from(
    new Set(
      value.filter((item): item is OptionValue<T> => isOptionValue(item, options)),
    ),
  );
}

export function restoreOnboardingAnswers(value: unknown): OnboardingAnswers {
  if (!value || typeof value !== "object") return EMPTY_ONBOARDING_ANSWERS;
  const draft = value as Partial<Record<keyof OnboardingAnswers, unknown>>;
  const restoredHabits = optionValues(draft.habits, HABIT_OPTIONS);
  const habits = restoredHabits.some((habit) => habit !== "none")
    ? restoredHabits.filter((habit) => habit !== "none")
    : restoredHabits;

  return {
    relationship: isOptionValue(draft.relationship, RELATIONSHIP_OPTIONS)
      ? draft.relationship
      : "",
    goals: optionValues(draft.goals, GOAL_OPTIONS),
    age: isOptionValue(draft.age, AGE_OPTIONS) ? draft.age : "",
    distance: isOptionValue(draft.distance, DISTANCE_OPTIONS) ? draft.distance : "",
    remoteContact: isOptionValue(draft.remoteContact, CONTACT_OPTIONS)
      ? draft.remoteContact
      : "",
    physicalContact: isOptionValue(draft.physicalContact, CONTACT_OPTIONS)
      ? draft.physicalContact
      : "",
    technology: isOptionValue(draft.technology, TECHNOLOGY_OPTIONS)
      ? draft.technology
      : "",
    habits,
    cadence: isOptionValue(draft.cadence, CADENCE_OPTIONS) ? draft.cadence : "",
    committed: draft.committed === true,
  };
}

export function optionLabel<T extends readonly { value: string; label: string }[]>(
  options: T,
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? "";
}
