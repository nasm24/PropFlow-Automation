import { type APIRequestContext, type APIResponse } from "@playwright/test";
import type { InvalidPropertyWrite, PropertyWrite } from "../types/property";

export class PropertiesClient {
  constructor(private readonly request: APIRequestContext) {}

  list(): Promise<APIResponse> {
    return this.request.get("/api/properties");
  }

  create(body: PropertyWrite | InvalidPropertyWrite): Promise<APIResponse> {
    return this.request.post("/api/properties", { data: body });
  }

  getById(id: string | number): Promise<APIResponse> {
    return this.request.get(`/api/properties/${id}`);
  }

  update(id: string | number, body: PropertyWrite | InvalidPropertyWrite): Promise<APIResponse> {
    return this.request.put(`/api/properties/${id}`, { data: body });
  }

  delete(id: string | number): Promise<APIResponse> {
    return this.request.delete(`/api/properties/${id}`);
  }
}
