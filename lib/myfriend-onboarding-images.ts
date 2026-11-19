import type { Relationship } from './myfriend-onboarding';

const imageScenes = {
  intro: { file: 'hero-photo', description: 'talking to MyFriend on the phone' },
  reflection: { file: 'family-check-in', description: 'chatting on the phone while a family member receives a MyFriend update' },
  technology: { file: 'simple-phone-call', description: 'talking to MyFriend on a familiar landline telephone' },
  reminders: { file: 'reminder-call', description: 'receiving a reminder call beside a pill organizer and a glass of water' },
  reports: { file: 'daily-update', description: '' },
  thankYou: { file: 'payment-thank-you-single', description: 'smiling during a call with MyFriend in a sunlit living room' },
} as const;

export function onboardingImage(scene: keyof typeof imageScenes, relationship: Relationship | '') {
  const male = scene !== 'intro' && (relationship === 'dad' || relationship === 'grandfather');
  const image = imageScenes[scene];
  const extension = scene === 'intro' ? 'jpg' : 'png';
  return {
    src: `/images/robo-companion/figma-refresh/${image.file}${male ? (scene === 'technology' ? '-male-v2' : '-male') : ''}.${extension}`,
    alt: scene === 'reports'
      ? `A family member reading a MyFriend update with a photograph of an older ${male ? 'man' : 'woman'} nearby`
      : `An older ${male ? 'man' : 'woman'} ${image.description}`,
    width: scene === 'intro' ? 1658 : 1536,
    height: scene === 'intro' ? 1104 : 1024,
  };
}
