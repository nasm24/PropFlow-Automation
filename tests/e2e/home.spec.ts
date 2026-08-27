import { test, expect } from "../../src/fixtures";

test.describe("home", () => {
  test("shows the authenticated home heading", async ({ app }) => {
    await app.home.open();
    await expect(app.home.heading).toBeVisible();
  });
});
