import type { Metadata } from "next";
import Link from "next/link";
import { MyFriendLegalPage } from "@/components/myfriend-legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | MyFriend",
  description: "Terms for using MyFriend’s AI conversations, reminders, and family updates.",
};

export default function TermsPage() {
  return (
    <MyFriendLegalPage title="Terms of Service">
      <section>
        <p>These terms apply to MyFriend, operated by GrowByte, Inc. By using MyFriend, you agree to these terms. Questions? Contact <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>.</p>
      </section>
      <section>
        <h2>What MyFriend provides</h2>
        <p>MyFriend provides AI conversations, scheduled check-in calls, reminders, and optional family updates. You are interacting with AI, not a human. Features and availability depend on your plan, settings, permissions, and supported communication channels.</p>
        <p>MyFriend is not a medical provider, emergency service, or monitored safety system. It cannot diagnose conditions, verify that medication was taken, or guarantee someone’s wellbeing. Reminder responses and family updates reflect available conversation information and may be incomplete or incorrect. For an emergency, contact your local emergency services.</p>
      </section>
      <section>
        <h2>Accounts and permission</h2>
        <p>You must be an adult to create an account. Provide accurate contact and billing information, keep your sign-in codes private, and tell us if you suspect unauthorized access.</p>
        <p>If you set up MyFriend for someone else, explain the service to them and make sure they want to participate. Their preferences control whether they receive calls and share family updates. Do not use the service to contact people without permission.</p>
      </section>
      <section>
        <h2>Calls, messages, and family updates</h2>
        <p>By opting into calls or messages, you agree to receive the communications associated with your settings, including automated calls, reminders, account messages, and requested family updates. Frequency varies with the service and saved preferences. Carrier message, data, or call charges may apply.</p>
        <p>You can ask MyFriend to stop scheduled calls or change sharing preferences, or contact us for help stopping communications. Delivery can be delayed or fail because of carrier, network, or provider issues. A missed-call update does not establish that someone is in danger, and the absence of an update does not establish that they are safe.</p>
      </section>
      <section>
        <h2>Subscriptions and cancellation</h2>
        <p>The price, billing interval, and any trial or promotional conditions are shown at checkout. Recurring subscriptions renew and charge your chosen payment method until canceled. You authorize those recurring charges when you subscribe.</p>
        <p>You can open <Link href="/myfriend/dashboard">your dashboard</Link>, select Settings, then “Manage subscription” to open Stripe’s billing portal. Cancel before your next renewal to stop the next recurring charge. For help, or to request a refund, contact <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a>. Turning off calls does not by itself cancel a paid subscription.</p>
        <p>If you are an EU consumer, you generally have 14 days from entering into an online service contract to withdraw without giving a reason. To notify us, email <a href="mailto:oliver@growbyte.co">oliver@growbyte.co</a> with your account email, order date, and a clear statement that you wish to withdraw. Using MyFriend does not by itself waive mandatory withdrawal or refund rights. Any deductions for services already provided must be permitted by applicable law. Your statutory rights for a faulty or misdescribed service also remain unchanged.</p>
      </section>
      <section>
        <h2>Responsible use</h2>
        <p>Do not use MyFriend for unlawful activity, harassment, impersonation, unsolicited communications, or attempts to disrupt or gain unauthorized access to the service. You must have permission to provide another person’s information.</p>
        <p>You retain rights to the content you provide. You permit us and our service providers to process it as needed to provide the service, including generating replies, reminders, and authorized summaries. Our <Link href="/myfriend/privacy">Privacy Policy</Link> explains how we handle personal information.</p>
      </section>
      <section>
        <h2>Availability and changes</h2>
        <p>We work to keep MyFriend available, but do not guarantee uninterrupted access, successful delivery of every call or message, or the accuracy of AI outputs. We may update features, address technical issues, or suspend access to prevent misuse or comply with law.</p>
        <p>We may update these terms and will show the revised date here. Nothing in these terms limits rights or remedies that cannot be excluded under applicable consumer law.</p>
      </section>
    </MyFriendLegalPage>
  );
}
