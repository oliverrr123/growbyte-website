# Production deployment requirements

The user explicitly requires testing before every production change. Test the exact candidate release in a preview or sandbox before publishing it; a successful build or mocked unit test alone is insufficient.

- Exercise affected browser flows and real service integrations. Cover existing users as well as new users, including free and subscribed accounts where relevant.
- For phone onboarding, coordinate with the API and ElevenLabs configuration: verify actual conversation startup with candidate tools and initialization payloads. Check missing dynamic variables on ordinary calls, not just the new onboarding path.
- Verify payment amount, currency, recurrence, authentication, and retry behavior without charging a customer.
- Preserve unrelated local and live changes, review the precise deployment scope, and keep a known-good rollback target.
- Verify affected live paths after deployment and restore working behavior promptly if they fail. Report concrete checks and remaining gaps accurately.
