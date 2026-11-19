import { type FunnelStep, type Goal, type OnboardingAnswers, type Relationship } from "./myfriend-onboarding";

// Verbatim source: Figma page 171:3, “Current onboarding · Mobile screens”.
// Keep wording as authored, except for the approved personalized reflection below.
export const RELATIONSHIP_NOUNS: Record<Relationship, string> = {
  mom: "mom", dad: "dad", grandmother: "grandma", grandfather: "grandpa",
  partner: "partner", "someone-else": "loved one",
};
export function personalizeOnboardingText(text: string, answers: Pick<OnboardingAnswers, "relationship">): string {
  const relationship = RELATIONSHIP_NOUNS[answers.relationship as Relationship] || "loved one";
  const female = answers.relationship === "mom" || answers.relationship === "grandmother";
  const male = answers.relationship === "dad" || answers.relationship === "grandfather";
  const neutral = !female && !male;
  const subject = female ? "she" : male ? "he" : "they";
  const capital = (value: string) => value[0].toUpperCase() + value.slice(1);
  const tokens: Record<string, string> = {
    relationship,
    person: relationship === "partner" || relationship === "loved one" ? "your " + relationship : relationship,
    subject, Subject: capital(subject),
    object: female ? "her" : male ? "him" : "them",
    possessive: female ? "her" : male ? "his" : "their",
    Possessive: female ? "Her" : male ? "His" : "Their",
    subjectBe: subject + (neutral ? "’re" : "’s"),
    SubjectBe: capital(subject) + (neutral ? "’re" : "’s"),
    avoid: neutral ? "avoid" : "avoids", use: neutral ? "use" : "uses",
    choose: neutral ? "choose" : "chooses", want: neutral ? "want" : "wants",
    need: neutral ? "need" : "needs", agree: neutral ? "agree" : "agrees",
    forget: neutral ? "forget" : "forgets",
  };
  return text.replace(/\{(\w+)\}/g, (placeholder, key) => tokens[key] ?? placeholder);
}
export type OnboardingCopy = { title: string; body?: string; action?: string; note?: string };
export const ORIGINAL_ONBOARDING_COPY: Record<FunnelStep, OnboardingCopy> = {
  "intro": {
    "title": "Let’s make MyFriend personalized to your needs",
    "action": "Let’s go",
    "note": "Takes ~3 minutes"
  },
  "relationship": {
    "title": "Who are you setting MyFriend up for?"
  },
  "goals": {
    "title": "How do you want MyFriend to help?",
    "body": "Choose everything that feels true.",
    "action": "Continue"
  },
  "capabilities": {
    "title": "MyFriend can:",
    "action": "Continue"
  },
  "age": {
    "title": "How old is your {relationship}?"
  },
  "distance": {
    "title": "How close do you live to your {relationship}?"
  },
  "remote-contact": {
    "title": "How often do you and your {relationship} talk when you’re apart?",
    "body": "Think of phone calls, messages, or video calls."
  },
  "physical-contact": {
    "title": "How often do you spend time with your {relationship} in person?"
  },
  "reflection": {
    "title": "Little things can happen, but when there’s no one checking up for days, they can turn into tragedies.",
    "body": "MyFriend will check in on your loved ones every day so you know they’re safe and also encourage you to call them more and keep in contact!",
    "action": "Continue"
  },
  "technology": {
    "title": "How does your {relationship} usually feel about technology?"
  },
  "technology-response": {
    "title": "MyFriend is a simple phone call.",
    "body": "No app, no internet needed. It’s a simple phone number {subject} can even call offline from a landline!",
    "action": "Continue"
  },
  "habits": {
    "title": "What might your {relationship} want a little help remembering?",
    "body": "Choose anything that could be useful. {Subject} {choose} which reminders to set.",
    "action": "Continue"
  },
  "reminders": {
    "title": "MyFriend can call {object} any time {subject} {need}.",
    "body": "To remind to take {possessive} medications, of a doctor’s appointment, to drink enough water, or any other thing.",
    "action": "Continue"
  },
  "cadence": {
    "title": "How often do you want MyFriend to check up on {person}?"
  },
  "reports": {
    "title": "Peace of mind",
    "body": "MyFriend will check up on {person} every single day and then send you a short message about how {subjectBe} doing, what did {subject} do today and if {subject} took all {possessive} medications on time.\nIf MyFriend doesn’t reach {person}, it will also send you a message, that maybe you should check up on {object} yourself.",
    "action": "Continue"
  },
  "building": {
    "title": "Bringing the pieces together…",
    "body": "Creating a personalized experience",
    "action": "Continue"
  },
  "plan": {
    "title": "Your setup is ready!",
    "body": "Based on what you’ve shared, we’ve created a tailored experience just for you and your {relationship}.\n\nMyFriend will never take your place. It can simply be there in some of the moments when you can’t.\n\nMyFriend will also keep you accountable to call your {relationship}.",
    "action": "Continue"
  },
  "cost": {
    "title": "A 24/7 companion, for the price of one meal.",
    "action": "Continue"
  },
  "pricing": {
    "title": "Join 250+ happy users.",
    "body": "Get unlimited access to MyFriend for your {relationship}. You will also get the founder’s personal phone number so you can ask questions or get help any time."
  }
};
export function onboardingCopy(answers: OnboardingAnswers): Record<FunnelStep, OnboardingCopy> {
  const copy = Object.fromEntries(Object.entries(ORIGINAL_ONBOARDING_COPY).map(([step, copy]) => [
    step, Object.fromEntries(Object.entries(copy).map(([key, text]) => [key, personalizeOnboardingText(text, answers)])),
  ])) as Record<FunnelStep, OnboardingCopy>;
  copy.reflection = reflectionCopy(answers);
  copy.reports = reportsCopy(answers);
  copy.plan = {
    title: "Your setup is ready!",
    action: "Continue",
  };
  copy["technology-response"] = technologyResponseCopy(answers);
  return copy;
}

export function reportsCopy(answers: OnboardingAnswers): OnboardingCopy {
  const frequency = {
    "multiple-daily": "multiple times per day",
    daily: "every day",
    "few-weekly": "a few times each week",
    "inbound-only": "",
    "": "",
  }[answers.cadence];
  const medication = answers.habits.includes("medication")
    ? ", including whether {subject} said {subject} took {possessive} medications"
    : "";
  const summary = `After each call, MyFriend will send you a short message about how {subjectBe} doing and what {subject} did that day${medication}.`;
  const body = frequency
    ? `MyFriend will check up on {person} ${frequency}. ${summary}\nIf MyFriend doesn’t reach {person}, it will send you a message so you can check up on {object} yourself.`
    : "No check-ins for now. If you set them up later, MyFriend will call {person} to check in and send you a short update on how {subjectBe} doing.";
  return {
    title: "Peace of mind",
    body: personalizeOnboardingText(body, answers),
    action: "Continue",
  };
}

export function technologyResponseCopy(answers: OnboardingAnswers): OnboardingCopy {
  const variants = {
    ai: {
      title: "AI {subject} can talk to over the phone.",
      body: "{Subject} can use AI just by calling MyFriend’s phone number. No app or internet connection needed. Even a landline works.",
    },
    avoids: {
      title: "No new technology to learn.",
      body: "If {subject} can make a phone call, {subject} can use MyFriend. {Subject} can just call a phone number and talk. No app or internet connection needed.",
    },
    web: {
      title: "Use the phone {subject} already {use}.",
      body: "{Subject} can talk to MyFriend by calling a phone number. Nothing to download, no internet connection needed. It works from a mobile phone or a landline.",
    },
    unsure: {
      title: "MyFriend is a simple phone call.",
      body: "{Subject} can just call MyFriend’s phone number and talk. No app or internet connection needed. Even a landline works.",
    },
  };
  const variant = variants[answers.technology || "unsure"];
  return {
    title: personalizeOnboardingText(variant.title, answers),
    body: personalizeOnboardingText(variant.body, answers),
    action: "Continue",
  };
}

export function reflectionCopy(answers: OnboardingAnswers): OnboardingCopy {
  const noun = RELATIONSHIP_NOUNS[answers.relationship as Relationship] || "loved one";
  const person = noun === "partner" || noun === "loved one" ? `your ${noun}` : noun;
  const female = answers.relationship === "mom" || answers.relationship === "grandmother";
  const male = answers.relationship === "dad" || answers.relationship === "grandfather";
  const possessive = female ? "her" : male ? "his" : "their";
  const unanswered = female ? "she doesn’t" : male ? "he doesn’t" : "they don’t";
  const rarelyVisits = answers.physicalContact === "monthly" || answers.physicalContact === "yearly";
  const talksOften = answers.remoteContact === "daily" || answers.remoteContact === "weekly";
  const dailyContact = answers.distance === "together" || answers.physicalContact === "daily" || answers.remoteContact === "daily";

  let title = `When you haven’t spoken in a few days, it’s hard to know how ${person}’s doing.`;
  if (answers.distance !== "together" && rarelyVisits && talksOften) {
    title = `You talk to ${person} often. But you can’t always be there in person.`;
  } else if (dailyContact) {
    title = `You already check in on ${person}. MyFriend can help with the reminders in between.`;
  }

  return {
    title,
    body: `MyFriend can call ${person}, ask about ${possessive} day, and send you a short update. If ${unanswered} answer, you’ll know.`,
    action: "Continue",
  };
}
export const CAPABILITY_COPY: Record<Goal, string> = {
  conversation: "Give {object} a companion {subject} can call any time, day and night",
  questions: "Help {object} stay more independent by answering questions and helping with problems",
  reminders: "Call {object} to remind {object} to take {possessive} medications so {subject} never {forget}",
  checkins: "Check up on {object} every day and send you a short summary of how {subjectBe} doing, if {subject} took {possessive} medications and more",
  "family-contact": "Keep you accountable on keeping in touch with {object} yourself",
};
export function selectedCapabilityCopy(answers: OnboardingAnswers): string[] {
  return (Object.entries(CAPABILITY_COPY) as [Goal, string][])
    .filter(([goal]) => answers.goals.includes(goal))
    .map(([, text]) => personalizeOnboardingText(text, answers));
}
export const BUILDING_COPY = [
  "Tailoring the plan",
  "Preparing reminders",
  "Preparing daily checkins"
];
export function selectedPlanCopy(answers: OnboardingAnswers): string[] {
  const items: string[] = [];
  const frequency = {
    "multiple-daily": "multiple times per day",
    daily: "every day",
    "few-weekly": "a few times each week",
    "inbound-only": "",
    "": "",
  }[answers.cadence];

  if (answers.goals.includes("conversation")) {
    items.push("A companion {subject} can call any time, day and night");
  }
  if (answers.goals.includes("questions")) {
    items.push("Answers to {possessive} questions and help with everyday problems");
  }
  if (frequency) {
    items.push(`Check-in calls to {person} ${frequency}`);
  }

  const reminders = [
    answers.habits.includes("medication") ? "medications" : "",
    answers.habits.includes("routines") ? "daily routines and small tasks" : "",
    answers.habits.includes("appointments") ? "appointments and plans" : "",
  ].filter(Boolean);
  if (reminders.length) {
    const joined = reminders.length === 1 ? reminders[0]
      : reminders.slice(0, -1).join(", ") + " and " + reminders.at(-1);
    items.push(`Reminders for ${joined}`);
  }

  if (frequency || answers.goals.includes("checkins")) {
    items.push(answers.habits.includes("medication")
      ? "A short update after each call, including whether {subject} said {subject} took {possessive} medications"
      : "A short update after each call about how {subjectBe} doing");
    if (frequency) items.push("A message to you if MyFriend can’t reach {object}");
  }
  if (answers.goals.includes("family-contact")) {
    items.push(answers.distance === "together"
      ? "Reminders for you to spend time with {object} yourself"
      : "Reminders for you to call, message or visit {object} yourself");
  }
  items.push(answers.technology === "ai"
    ? "AI {subject} can use just by calling a phone number, no internet needed"
    : answers.technology === "avoids"
      ? "A familiar phone call, no app or new technology to learn"
      : "Works from {possessive} phone, even a landline. No app or internet needed");
  return items.map(item => personalizeOnboardingText(item, answers));
}
export const TESTIMONIAL_COPY = [
  "“MyFriend helps me reduce loneliness”",
  "“Thanks to MyFriend, I know my grandma is safe”",
  "“After she got MyFriend, she never forgot her pills again.”"
];
