import { test as base, type APIRequestContext } from "@playwright/test";
import { apiBaseUrl, createApiContext } from "../api/clients/http";

type AuthFixtures = {
  api: APIRequestContext;
};

/**
 * `api` is an authenticated request context (same storageState as the browser).
 * Use it to seed or clean up data without clicking through the UI.
 *
 * Browser login itself lives in tests/auth.setup.ts (setup project).
 * For tests that mutate a shared user, switch to a worker-scoped storageState
 * using Playwright's "one account per worker" pattern:
 * https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker
 */
export const test = base.extend<AuthFixtures>({
  api: async ({ storageState }, use) => {
    const context = await createApiContext({
      baseURL: apiBaseUrl(),
      storageState,
    });
    await use(context);
    await context.dispose();
  },
});
