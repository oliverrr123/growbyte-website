# MyFriend onboarding review

The edited Figma sequence is now implemented locally. The original Figma page is preserved; the new page is **Onboarding · polished · Sep 8**, with 26 editable mobile frames. The website and Figma use the same questions, choices, examples, and prices. Figma uses Inter because SF Pro did not render correctly through the Figma connection.

## Changes made

- Kept the centered logo, thin progress bar, plain back arrow, single-select auto-advance, and gradual transitions.
- Reduced oversized headings and cards; kept clear selection states and one primary action per screen.
- Replaced vague benefits with phone-call, reminder, and report examples.
- Added an age skip and removed the pledge requirement. Preferences are still saved before checkout.
- Replaced “setup is ready” with a preference summary. Calls are not scheduled merely by answering the questionnaire.
- Put monthly and annual plans together, with the full charge and renewal period visible before Stripe.
- Removed the unverified user count and testimonials from the proposed version. Left the originals in the source Figma page.
- Labeled scheduled check-ins and SMS reports as coming soon. The current SMS launch blocker is carrier registration; changing the copy does not turn that feature on.

## What I would change next, in priority order

| Priority | Recommendation | Reason |
| --- | --- | --- |
| 1 | Put a real 15–30 second call recording before the price. Caption it so people can understand it without sound. | The main buying question is what talking to MyFriend actually feels like. A real example answers it directly. Do not use a fabricated customer recording. |
| 2 | Finish scheduled check-ins and SMS delivery before selling those as included, working benefits. | Several questions are about these features. A polished funnel cannot fix a mismatch between what someone wants and what is available. |
| 3 | Test a shorter version that removes the early “Here’s what you’re looking for” recap, the separate price introduction, and the summary-loading screen. Keep the final summary and plan selection. | These repeat information rather than collecting an answer or resolving a new concern. Keep the transition animation without adding an artificial wait screen. |
| 4 | Combine call/text frequency and visit frequency into one question, or move visit frequency after checkout. Keep age optional. | Keep a question only if its answer changes the experience or gives you information you will use. |
| 5 | Use one specific, verified testimonial beside the call sample or price. | A concrete account of what happened is more useful than “250+ happy users.” Claims about never forgetting medication need evidence and should not imply guaranteed adherence. |
| 6 | Keep “AI phone assistant” explicit, explain what is shared in a report, and show a missed-call example. | Buyers need to understand who is calling and what an update does—and does not—tell them. Avoid “know they’re safe.” |

Suggested next copy test: **“Hear what a call sounds like.”** Then a real recording, followed by **“They use their own phone. No app to install.”** The existing question/reminder examples can stay underneath.

## How to judge conversion

Treat these recommendations as hypotheses, not guaranteed uplift. Compare completed payments per onboarding start, paid setup completion, and cancellations/refunds. Track drop-off by screen and by selected goal; more checkout clicks alone do not prove a better outcome.

The advice to remove unnecessary questions follows [Nielsen Norman Group’s form-design guidance](https://www.nngroup.com/articles/web-form-design/). Clear prices and payment expectations follow [Baymard’s payment UX guidance](https://baymard.com/learn/payment-ux). Neither source proves a conversion lift for this specific flow.

## Verification

TypeScript passes. The 21 onboarding/billing route tests pass, including answer persistence, monthly/annual amounts, unpaid checkout rejection, verification, and saving without an age answer or pledge. Browser review covers the actual phone layout and navigation; Figma frames were screenshot-checked and audited for text outside frame bounds. No live payment or SMS was sent during this review.
