import type { Goal, OnboardingAnswers } from './myfriend-onboarding';
import { personalizeOnboardingText } from './myfriend-onboarding-content';

// Illustrative scenarios, not customer quotes or evidence of customer outcomes.
export function onboardingExamples(answers: OnboardingAnswers) {
  const medication = answers.habits.includes('medication');
  const scheduled = Boolean(answers.cadence && answers.cadence !== 'inbound-only');
  const cards: { id: string; topic: string; text: string; portrait: string; goal?: Goal }[] = [
    { id: 'conversation', topic: 'Someone to talk to', goal: 'conversation', portrait: 'casual-senior-woman',
      text: 'A quiet evening after dinner. {Subject} can call MyFriend for a chat whenever {subject} {want}.' },
    { id: 'questions', topic: 'Everyday questions', goal: 'questions', portrait: 'casual-parent-man',
      text: 'A question comes up about a recipe or something on TV. {Subject} can ask over the phone.' },
    { id: 'reminders', topic: medication ? 'Medication reminders' : 'Remembering plans', goal: 'reminders', portrait: 'casual-parent-woman',
      text: medication ? 'A call at medication time reminds {object} to take {possessive} pills. {Subject} can say whether {subject} took them.'
        : answers.habits.includes('appointments') ? 'An appointment is coming up. A reminder call can help {object} remember when to get ready.'
        : 'If {subject} {want} a reminder later, {subject} can set one up for an appointment or an everyday task.' },
    { id: 'checkins', topic: scheduled ? 'A short update' : 'Check-ins when you want them', goal: 'checkins', portrait: 'casual-parent-man',
      text: scheduled ? 'After a check-in call, you get a short update about how {person} is doing. If there’s no answer, you get a message.'
        : 'You skipped regular check-ins. If you set them up later, MyFriend can call {person} and send you an update afterward.' },
    { id: 'family-contact', topic: 'Keeping in touch', goal: 'family-contact', portrait: 'casual-parent-woman',
      text: answers.distance === 'together' ? 'A reminder to put some time aside and sit down with {object}, even on a busy day.'
        : 'A nudge to call, message or visit {person} yourself when the week gets busy.' },
    { id: 'technology', topic: answers.technology === 'ai' ? 'Trying AI' : 'Just a phone call', portrait: 'casual-senior-woman',
      text: answers.technology === 'ai' ? '{Subject} can try AI by dialing a phone number and asking a question. Nothing to download.'
        : 'Pick up the phone, dial MyFriend and start talking. It works from a landline too.' },
  ];
  return cards
    .map((card, index) => ({ ...card, index, relevant: card.goal ? answers.goals.includes(card.goal) : answers.technology === 'ai' }))
    .sort((a, b) => Number(b.relevant) - Number(a.relevant) || a.index - b.index)
    .map(card => ({ ...card, text: personalizeOnboardingText(card.text, answers) }));
}
