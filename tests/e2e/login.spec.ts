import { test, expect } from "../../src/fixtures";
import { getUser } from "../../src/auth/roles";

test.describe("login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("signs in through the UI", async ({ app, page }) => {
    const user = getUser();
    await app.login.open();
    await app.login.signIn(user.email, user.password);
    await expect(page).not.toHaveURL(/\/login/);
  });
});
