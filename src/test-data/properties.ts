import type { InvalidPropertyWrite, PropertyWrite } from "../api/types/property";

export const MISSING_PROPERTY_ID = 999999;

export function validProperty(): PropertyWrite {
  return {
    name: "Playwright Apartments",
    address: "456 Automation St",
    city: "Austin",
    state: "TX",
    zipCode: "78702",
    propertyType: "APARTMENT",
    totalUnits: 25,
  };
}

export function uniqueProperty(overrides?: Partial<PropertyWrite>): PropertyWrite {
  const suffix = Date.now();
  return {
    name: `CRUD Lifecycle ${suffix}`,
    address: `${suffix} Lifecycle Ave`,
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    propertyType: "APARTMENT",
    totalUnits: 25,
    ...overrides,
  };
}

export function validPropertyForUpdate(): PropertyWrite {
  return {
    name: "Missing Property Update",
    address: "1 Not Found Blvd",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    propertyType: "APARTMENT",
    totalUnits: 10,
  };
}

export function invalidProperty(): InvalidPropertyWrite {
  return {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: null,
    totalUnits: 0,
  };
}

export type InvalidFieldCase = {
  field: keyof InvalidPropertyWrite;
  value: string | number | null;
};

export const invalidFieldCases: InvalidFieldCase[] = [
  { field: "name", value: "" },
  { field: "address", value: "" },
  { field: "city", value: "" },
  { field: "state", value: "" },
  { field: "zipCode", value: "" },
  { field: "propertyType", value: null },
  { field: "totalUnits", value: 0 },
];

