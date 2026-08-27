import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByLabel(/email/i);
    this.password = page.getByLabel(/password/i);
    this.submit = page.getByRole("button", { name: /sign in|log in/i });
  }

  async open(): Promise<void> {
    await this.goto("/login");
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
