import { type APIRequestContext, expect } from "@playwright/test";
import type { TestUser } from "../../auth/roles";

/**
 * Cookie-based API login. Change the path and body to match your app.
 * Set-Cookie on this context is what storageState() persists for UI tests.
 */
export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(user: TestUser): Promise<void> {
    const response = await this.request.post("/login", {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    expect(
      response.ok(),
      `API login failed: ${response.status()} ${await response.text()}`,
    ).toBe(true);
  }
}
