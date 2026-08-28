import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import type { PropertyWrite } from "../api/types/property";

export class PropertiesPage extends BasePage {
  readonly heading: Locator;
  readonly addPropertyButton: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Properties", level: 1 });
    this.addPropertyButton = page.getByRole("button", { name: "Add Property" });
    this.table = page.getByRole("table");
  }

  async open(): Promise<void> {
    await this.goto("/");
    await this.heading.waitFor();
  }

  createFormHeading(): Locator {
    return this.page.getByRole("heading", { name: "Add property" });
  }

  editFormHeading(): Locator {
    return this.page.getByRole("heading", { name: "Edit property" });
  }

  async openCreateForm(): Promise<void> {
    await this.addPropertyButton.click();
    await this.createFormHeading().waitFor();
  }

  async fillProperty(property: PropertyWrite): Promise<void> {
    await this.page.getByLabel("Name").fill(property.name);
    await this.page.getByLabel("Address").fill(property.address);
    await this.page.getByLabel("City").fill(property.city);
    await this.page.getByLabel("State").fill(property.state);
    await this.page.getByLabel("ZIP Code").fill(property.zipCode);
    await this.page.getByLabel("Property Type").selectOption(property.propertyType);
    await this.page.getByLabel("Total Units").fill(String(property.totalUnits));
  }

  async submitCreate(): Promise<void> {
    await this.page.getByRole("button", { name: "Create property" }).click();
  }

  async submitSave(): Promise<void> {
    await this.page.getByRole("button", { name: "Save changes" }).click();
  }

  rowByName(name: string): Locator {
    return this.page.getByRole("row", { name: new RegExp(escapeRegExp(name)) });
  }

  async editProperty(name: string): Promise<void> {
    await this.rowByName(name).getByRole("button", { name: "Edit" }).click();
    await this.editFormHeading().waitFor();
  }

  async fillTotalUnits(totalUnits: number): Promise<void> {
    await this.page.getByLabel("Total Units").fill(String(totalUnits));
  }

  async deleteProperty(name: string): Promise<void> {
    await this.rowByName(name).getByRole("button", { name: "Delete" }).click();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
