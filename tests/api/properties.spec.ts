import { test, expect } from "@playwright/test";
import { expectValidProperty } from "../../src/api/assertions/property.contract";
import { PropertiesClient } from "../../src/api/clients/properties.client";
import {
  invalidFieldCases,
  invalidProperty,
  MISSING_PROPERTY_ID,
  uniqueProperty,
  validProperty,
  validPropertyForUpdate,
} from "../../src/test-data/properties";

test.describe("Properties API", () => {
  test("GET /api/properties should return 200", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const response = await propertiesApi.list();

    expect(response.status()).toBe(200);

    const properties = await response.json();

    expect(Array.isArray(properties)).toBe(true);
  });

  test("POST /api/properties should create a property", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const property = validProperty();

    const createResponse = await propertiesApi.create(property);

    expect(createResponse.status()).toBe(201);

    const createdProperty = await createResponse.json();
    expectValidProperty(createdProperty);

    expect(createdProperty.id).toBeDefined();
    expect(createdProperty.name).toBe(property.name);
    expect(createdProperty.city).toBe(property.city);
    expect(createdProperty.totalUnits).toBe(property.totalUnits);

    const propertyId = createdProperty.id;

    const getResponse = await propertiesApi.getById(propertyId);

    expect(getResponse.status()).toBe(200);

    const retrievedProperty = await getResponse.json();
    expectValidProperty(retrievedProperty);

    expect(retrievedProperty.id).toBe(propertyId);
    expect(retrievedProperty.name).toBe(property.name);
    expect(retrievedProperty.address).toBe(property.address);
    expect(retrievedProperty.city).toBe(property.city);
    expect(retrievedProperty.state).toBe(property.state);
    expect(retrievedProperty.zipCode).toBe(property.zipCode);
    expect(retrievedProperty.propertyType).toBe(property.propertyType);
    expect(retrievedProperty.totalUnits).toBe(property.totalUnits);
  });

  test("Property CRUD lifecycle", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const property = uniqueProperty();

    const createResponse = await propertiesApi.create(property);
    expect(createResponse.status()).toBe(201);

    const createdProperty = await createResponse.json();
    expectValidProperty(createdProperty);
    const propertyId = createdProperty.id as string | number;
    expect(propertyId).toBeDefined();

    const updateResponse = await propertiesApi.update(propertyId, {
      ...property,
      totalUnits: 50,
    });
    expect(updateResponse.status()).toBe(200);
    const updatedFromPut = await updateResponse.json();
    expectValidProperty(updatedFromPut);

    const getResponse = await propertiesApi.getById(propertyId);
    expect(getResponse.status()).toBe(200);

    const updatedProperty = await getResponse.json();
    expectValidProperty(updatedProperty);
    expect(updatedProperty.id).toBe(propertyId);
    expect(updatedProperty.name).toBe(property.name);
    expect(updatedProperty.address).toBe(property.address);
    expect(updatedProperty.city).toBe(property.city);
    expect(updatedProperty.state).toBe(property.state);
    expect(updatedProperty.zipCode).toBe(property.zipCode);
    expect(updatedProperty.propertyType).toBe(property.propertyType);
    expect(updatedProperty.totalUnits).toBe(50);

    const deleteResponse = await propertiesApi.delete(propertyId);
    expect(deleteResponse.status()).toBe(204);

    const missingResponse = await propertiesApi.getById(propertyId);
    expect(missingResponse.status()).toBe(404);
  });

  test("POST /api/properties with invalid payload should return 400", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const response = await propertiesApi.create(invalidProperty());

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("fieldErrors");
    expect(Array.isArray(body.fieldErrors)).toBe(true);
    expect(body.fieldErrors.length).toBeGreaterThan(0);
  });

  test("GET /api/properties/999999 should return 404", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const response = await propertiesApi.getById(MISSING_PROPERTY_ID);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.status).toBe(404);
    expect(body.message).toBeTruthy();
    expect(String(body.message)).toMatch(/property|not found|999999/i);
  });

  test("PUT /api/properties/999999 should return 404", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const response = await propertiesApi.update(MISSING_PROPERTY_ID, validPropertyForUpdate());

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.status).toBe(404);
  });

  test("DELETE /api/properties/999999 should return 404", async ({ request }) => {
    const propertiesApi = new PropertiesClient(request);
    const response = await propertiesApi.delete(MISSING_PROPERTY_ID);

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.status).toBe(404);
  });

  for (const { field, value } of invalidFieldCases) {
    test(`POST /api/properties rejects invalid ${field}`, async ({ request }) => {
      const propertiesApi = new PropertiesClient(request);
      const payload = {
        ...validProperty(),
        [field]: value,
      };
      const response = await propertiesApi.create(payload);

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty("fieldErrors");
      expect(Array.isArray(body.fieldErrors)).toBe(true);
      expect(
        body.fieldErrors.some((error: { field: string }) => error.field === field),
      ).toBe(true);
    });
  }
});
