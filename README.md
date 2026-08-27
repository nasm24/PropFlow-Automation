# PropFlow-Automation

Playwright E2E framework for PropFlow.

TypeScript E2E suite using Page Object Model, fixtures, and API-based authentication.

## Setup

```bash
npm install
npx playwright install chromium
copy .env.example .env
```

Edit `.env` with your app URL and a dedicated test user. Point `AuthClient.login` at your real login endpoint (`src/api/clients/auth.client.ts`).

## Run

```bash
npm test
npm run test:ui
```

The `setup` project logs in over the API once, writes `playwright/.auth/user.json`, and Chromium tests reuse that `storageState`. Login UI is covered only in `tests/e2e/login.spec.ts`.

Specs must import `test` and `expect` from `src/fixtures`, not from `@playwright/test`.
