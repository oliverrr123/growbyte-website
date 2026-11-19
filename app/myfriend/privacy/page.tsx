import type { Metadata } from "next";
import { MyFriendLegalPage } from "@/components/myfriend-legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | MyFriend",
  description: "How MyFriend handles account information, conversations, reminders, and family updates.",
};

export default function PrivacyPage() {
  return (
    <MyFriendLegalPage title="Privacy Policy">
      <section>
        <p>MyFriend is an AI companion operated by GrowByte, Inc. This policy explains how we handle personal information when you visit our website, set up an account, talk to MyFriend, or receive family updates.</p>
        <p>For privacy questions or requests, contact <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>.</p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <p>Account and setup information includes names, email addresses, phone numbers, your relationship to the person using MyFriend, time zones, selected preferences, and subscription status. If you arrange MyFriend for someone else, you may provide some of this information about them.</p>
        <p>Conversations may be recorded, transcribed, and summarized. We process what you share in calls and messages, including interests, preferences, reminders, and any health information you choose to discuss. We also keep call attempts, call outcomes, consent choices, and message delivery information.</p>
        <p>Our website collects technical and usage information, such as browser and device information, IP addresses, pages visited, and interactions with onboarding. Cookies and similar technologies support sign-in and analytics. Payments are processed by Stripe; we receive billing and subscription information rather than your full card details.</p>
      </section>
      <section>
        <h2>How we use information</h2>
        <p>We use this information to provide and personalize conversations, remember preferences, schedule calls and reminders, manage accounts and payments, provide support, troubleshoot delivery, prevent misuse, and understand and improve the service.</p>
        <p>MyFriend uses AI to process conversations and generate replies and summaries. These outputs can be inaccurate. Please avoid sharing information you do not want processed by the service.</p>
      </section>
      <section>
        <h2>Website analytics and cookies</h2>
        <p>We use cookies and browser storage for sign-in, checkout, saved preferences, and website analytics. PostHog helps us understand website interactions, onboarding steps, and checkout outcomes using browser identifiers. Analytics may begin when you visit the website.</p>
        <p>You can manage cookies and site storage through your browser settings. Blocking necessary storage may affect sign-in or checkout. For questions about analytics data or to make a privacy request, contact <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>.</p>
      </section>
      <section>
        <h2>Family updates and your choices</h2>
        <p>When the person using MyFriend agrees to family sharing, we can send brief updates to the family contact on the account. These may include everyday conversation highlights, reminder responses, missed call attempts, or saved calling preferences. Updates are intended to summarize relevant details, rather than forward raw transcripts.</p>
        <p>Permission to receive calls and permission to share family updates are separate choices. Paying for someone’s subscription does not replace their permission to share. You can tell MyFriend to change your calling or sharing preferences, or contact us for help.</p>
      </section>
      <section>
        <h2>Text messages (SMS)</h2>
        <p>If you opt in on your MyFriend account dashboard, we send you text messages about your loved one&rsquo;s MyFriend calls and reminders, such as one daily update at 8 pm in your time zone, from +1 888 940 8777. Message frequency: up to 1 message per day, plus occasional messages about your account. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help at any time, or turn messages off in your dashboard. Carriers are not liable for delayed or undelivered messages.</p>
        <p>We do not sell, rent, or share mobile phone numbers or text messaging opt-in data and consent with third parties or affiliates for their marketing or promotional purposes. We share phone numbers only with the providers that deliver our messages, and only to provide the service.</p>
      </section>
      <section>
        <h2>Service providers and disclosures</h2>
        <p>We use providers for hosting, data storage, AI conversation processing, phone calls, messages, payments, email, and analytics. These include ElevenLabs, Photon, Twilio, Stripe, and PostHog where their services are used. Providers process the information needed for those functions, and data may be processed outside your country, including in the United States.</p>
        <p>We may also disclose information when required by law, to address fraud or security incidents, to protect people’s rights and safety, or in connection with a business transfer.</p>
      </section>
      <section>
        <h2>Retention, security, and requests</h2>
        <p>Retention depends on the type of information and why it is needed, including providing the service, maintaining account history, resolving disputes, and meeting legal obligations. Contact us to ask about retention or request deletion. Some information may need to remain in billing records, backups, or records required by law.</p>
        <p>No online service can guarantee absolute security. Depending on where you live, you may have rights to access, correct, delete, or obtain a copy of your information, restrict or object to certain processing, withdraw consent, or complain to a data protection authority. Send requests to <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>; we may need to verify your identity.</p>
        <p>Withdrawing consent does not affect processing that was lawful before withdrawal. You can exercise your rights for your own information; we must verify authorization before providing access to someone else’s conversation data. In the EEA, you can contact your local supervisory authority, including the Czech Office for Personal Data Protection at <a href="https://uoou.gov.cz/">uoou.gov.cz</a>.</p>
      </section>
      <section>
        <h2>Children and policy updates</h2>
        <p>MyFriend is intended for adults, not children. Please contact us if a child has provided personal information. We may update this policy as the service changes and will show the updated date on this page.</p>
      </section>
    </MyFriendLegalPage>
  );
}
