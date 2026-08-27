import { type APIRequestContext, request as playwrightRequest } from "@playwright/test";

export function apiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://localhost:3000/api";
}

export async function createApiContext(
  options?: Parameters<typeof playwrightRequest.newContext>[0],
): Promise<APIRequestContext> {
  return playwrightRequest.newContext({
    baseURL: apiBaseUrl(),
    extraHTTPHeaders: { "Content-Type": "application/json" },
    ...options,
  });
}
