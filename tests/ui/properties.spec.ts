import { test, expect } from "@playwright/test";
import { PropertiesPage } from "../../src/pages/properties.page";
import { uniqueUiProperty } from "../../src/test-data/properties";

test.describe("Properties page", () => {
  test("Properties page loads", async ({ page }) => {
    const propertiesPage = new PropertiesPage(page);
    await propertiesPage.open();

    await expect(propertiesPage.heading).toBeVisible();
    await expect(propertiesPage.addPropertyButton).toBeVisible();
    await expect(page.getByText("Loading properties…")).toBeHidden();
    await expect(
      propertiesPage.table.or(page.getByText("No properties yet. Add one to get started.")),
    ).toBeVisible();
  });

  test("Create property", async ({ page }) => {
    const propertiesPage = new PropertiesPage(page);
    const property = uniqueUiProperty();

    await propertiesPage.open();
    await propertiesPage.openCreateForm();
    await propertiesPage.fillProperty(property);
    await propertiesPage.submitCreate();

    try {
      const row = propertiesPage.rowByName(property.name);
      await expect(row).toBeVisible();
      await expect(row).toContainText(property.name);
      await expect(row).toContainText(property.city);
      await expect(row).toContainText(String(property.totalUnits));
    } finally {
      await propertiesPage.deleteProperty(property.name);
    }
  });

  test("Edit property", async ({ page }) => {
    const propertiesPage = new PropertiesPage(page);
    const property = uniqueUiProperty();

    await propertiesPage.open();
    await propertiesPage.openCreateForm();
    await propertiesPage.fillProperty(property);
    await propertiesPage.submitCreate();

    const row = propertiesPage.rowByName(property.name);
    await expect(row).toBeVisible();

    await propertiesPage.editProperty(property.name);
    await propertiesPage.fillTotalUnits(50);
    await propertiesPage.submitSave();

    await expect(row).toBeVisible();
    await expect(row.getByRole("cell", { name: "50", exact: true })).toBeVisible();

    await propertiesPage.deleteProperty(property.name);
    await expect(row).toHaveCount(0);
  });

  test("Delete property", async ({ page }) => {
    const propertiesPage = new PropertiesPage(page);
    const property = uniqueUiProperty();

    await propertiesPage.open();
    await propertiesPage.openCreateForm();
    await propertiesPage.fillProperty(property);
    await propertiesPage.submitCreate();

    const row = propertiesPage.rowByName(property.name);
    await expect(row).toBeVisible();

    await propertiesPage.deleteProperty(property.name);
    await expect(row).toHaveCount(0);
  });
});
