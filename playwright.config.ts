import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { USER_STORAGE_STATE } from "./src/auth/storage-paths";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const baseURL = process.env.BASE_URL ?? "http://localhost:8081";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "api",
      testMatch: /api\/.*\.spec\.ts/,
    },

    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: "ui",
      testMatch: /ui\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
        trace: "retain-on-failure",
      },
    },

    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts|api\/.*\.spec\.ts|ui\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: USER_STORAGE_STATE,
      },
    },
  ],
});