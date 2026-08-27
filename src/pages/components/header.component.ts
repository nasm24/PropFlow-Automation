import { type Locator, type Page } from "@playwright/test";

export class HeaderComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole("banner");
  }

  accountMenu(): Locator {
    return this.root.getByRole("button", { name: /account|profile|user/i });
  }

  async signOut(): Promise<void> {
    await this.accountMenu().click();
    await this.page.getByRole("menuitem", { name: /sign out|log out/i }).click();
  }
}
