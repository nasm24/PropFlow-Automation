import fs from "fs";
import { test as setup } from "@playwright/test";
import { AuthClient } from "../src/api/clients/auth.client";
import { apiBaseUrl, createApiContext } from "../src/api/clients/http";
import { getUser } from "../src/auth/roles";
import { AUTH_DIR, USER_STORAGE_STATE } from "../src/auth/storage-paths";

setup("authenticate as user", async () => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const context = await createApiContext({
    baseURL: apiBaseUrl(),
    storageState: undefined,
  });

  try {
    await new AuthClient(context).login(getUser());
    await context.storageState({ path: USER_STORAGE_STATE });
  } finally {
    await context.dispose();
  }
});
