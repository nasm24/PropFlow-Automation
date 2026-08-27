import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { HeaderComponent } from "./components/header.component";

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole("heading", { level: 1 });
  }

  async open(): Promise<void> {
    await this.goto("/");
  }
}
