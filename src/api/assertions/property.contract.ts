import { expect } from "@playwright/test";

export const PROPERTY_TYPES = ["APARTMENT", "HOUSE", "CONDO", "TOWNHOUSE"] as const;

export function expectValidProperty(property: unknown): void {
  expect(property).toBeTruthy();
  expect(typeof property).toBe("object");

  const body = property as Record<string, unknown>;

  expect(body).toHaveProperty("id");
  expect(typeof body.id).toBe("number");
  expect(typeof body.name).toBe("string");
  expect(typeof body.address).toBe("string");
  expect(typeof body.city).toBe("string");
  expect(typeof body.state).toBe("string");
  expect(typeof body.zipCode).toBe("string");
  expect(typeof body.propertyType).toBe("string");
  expect(typeof body.totalUnits).toBe("number");

  expect(PROPERTY_TYPES as readonly string[]).toContain(body.propertyType);
  expect(Number.isInteger(body.totalUnits)).toBe(true);
  expect(body.totalUnits as number).toBeGreaterThan(0);
}
