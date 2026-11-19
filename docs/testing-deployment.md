# MyFriend testing deployment

- URL: https://testing.trymyfriend.com
- Vercel project: `myfriend-testing` (`prj_IP0DVwiI2Qs0zZHzie2OeXGnvlZI`).
- Every deployment URL, including the custom domain, requires Vercel Authentication (`ssoProtection.deploymentType: all`). Sign in with the owner's Vercel account, `oliver.cingl@gmail.com`. Existing Vercel team members also have access under Vercel's standard permission model.
- The root opens the full MyFriend website. Public pages and account routes stay on the testing domain; `/onboarding` and `/myfriend/onboarding` both work. Testing pages send `X-Robots-Tag: noindex, nofollow`.
- Stripe uses test mode: $25 monthly or $250 yearly. SMS verification uses the existing Twilio Verify service. The site connects to the existing MyFriend backend and shared Supabase project.
- Secrets are configured in the testing Vercel project. They are not committed.
- The testing project is separate from `growbyte-website`; publishing it does not promote changes to the public website.

Deploy updates from this worktree with:

```sh
vercel deploy --project myfriend-testing --prod --yes
```

Here `--prod` means the primary deployment of the separate testing project. It does not deploy the shared phone-call backend on Fly.io.

Verified initial deployment: anonymous requests redirect to Vercel login; authenticated root and onboarding API return 200; both Stripe checkout intervals and return URLs match the testing domain. Temporary checkout sessions were expired and their test onboarding records removed. No payment or SMS was sent during verification.


## September 15: production login routing fix

Live deployment: https://growbyte-website-p8dszfz6i-olivers-projects-d2129a21.vercel.app. Explicitly assigned only trymyfriend.com and www.trymyfriend.com. GrowByte domain remains on the same previous deployment.

The dashboard's anonymous redirect used hardcoded /myfriend/login, which production middleware forwarded to GrowByte (404). Browser navigation now selects the public MyFriend route by hostname. Middleware also serves /myfriend and /myfriend/* directly on the MyFriend host, preserving internal links generated after homepage rewrites.

Deployed from /tmp/myfriend-login-route-fix, an exact SHA-1-verified source snapshot of the previous live deployment (dpl_81d7AjcSxC7W71239AHxicS5rAgm) with only middleware.ts and lib/myfriend.ts changed, plus regression tests. Original local changes remain in the onboarding worktree. Minimal patch saved at artifacts/status/myfriend-login-routing.patch. No unrelated checkout/schedule changes deployed.

Twelve route tests and Vercel production build pass. Headless Chrome clicked Already a user? from the public homepage and reached https://trymyfriend.com/login with the Email me a code form visible and no browser errors. Both prefixed and public login/onboarding routes return HTTP 200. No login email was sent. Screenshot: artifacts/status/myfriend-login-fixed.png.


## September 15: email editor text replacements

Published https://growbyte-website-8loqq7s6g-olivers-projects-d2129a21.vercel.app to trymyfriend.com and www.trymyfriend.com only. Changed app/myfriend/login/page.tsx to a text input with autocorrect on, autocapitalize none, email inputmode/autocomplete. Submit trims the address and validates with a detached native required email input before requesting a code. This removes the email-input autocorrection restriction without losing validation. Local and live Chrome checks cover field attributes, invalid-address rejection and trailing-space trimming with the send endpoint intercepted; no email sent. Native user macOS text replacement expansion was not verified and remains browser/OS-dependent. Test: tests/verify-email-editor.cjs. Production build passed. Minimal patch: artifacts/status/myfriend-email-text-replacement.patch.


September 15 copy update: published https://growbyte-website-cbwtg6s4r-olivers-projects-d2129a21.vercel.app. Daily update paragraph now says: “You’ll get a message each evening about your loved one’s chats and reminders that day, if they choose to share. No calls, no message.” Production build and live dashboard bundle verified. Delivery flags unchanged.


September 15 personalized message copy: https://growbyte-website-o55f0piex-olivers-projects-d2129a21.vercel.app. MyFriendCheckins receives saved.relationship. Copy: “You’ll get a message to your number about how your grandma is doing. If she doesn’t pick up any calls that day, you’ll get an alert message.” Relationship/pronouns adapt for grandma, grandpa, mom, dad, partner and fallback loved one. Rendered all six variants, production build passed, live bundle verified. Delivery behavior and flags unchanged.
