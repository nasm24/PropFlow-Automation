export type PropertyWrite = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  totalUnits: number;
};

export type InvalidPropertyWrite = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string | null;
  totalUnits: number;
};

export type Property = PropertyWrite & {
  id: string | number;
};

export type ApiErrorBody = {
  status?: number;
  message?: string;
  fieldErrors?: unknown;
};
